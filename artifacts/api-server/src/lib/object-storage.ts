import https from "node:https";
import { randomBytes } from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const EXT_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name} for object storage.`);
  return value;
}

export function isObjectStorageConfigured(): boolean {
  return Boolean(
    process.env.S3_ENDPOINT?.trim() &&
      process.env.S3_ACCESS_KEY_ID?.trim() &&
      process.env.S3_SECRET_ACCESS_KEY?.trim(),
  );
}

function getBucket(): string {
  return process.env.S3_BUCKET?.trim() || "uploads";
}

function getS3Client(): S3Client {
  const tlsInsecure = process.env.S3_TLS_INSECURE === "true";

  return new S3Client({
    region: process.env.S3_REGION?.trim() || "ap-northeast-1",
    endpoint: requiredEnv("S3_ENDPOINT"),
    credentials: {
      accessKeyId: requiredEnv("S3_ACCESS_KEY_ID"),
      secretAccessKey: requiredEnv("S3_SECRET_ACCESS_KEY"),
    },
    forcePathStyle: true,
    requestHandler: new NodeHttpHandler({
      httpsAgent: new https.Agent({
        keepAlive: true,
        rejectUnauthorized: !tlsInsecure,
      }),
    }),
  });
}

export function publicObjectUrl(key: string): string {
  const bucket = getBucket();
  const base =
    process.env.S3_PUBLIC_URL_BASE?.trim() ||
    `${process.env.SUPABASE_URL?.replace(/\/$/, "")}/storage/v1/object/public`;
  return `${base}/${bucket}/${key}`;
}

export function objectKeyForUpload(
  mimeType: string,
  originalFilename?: string,
  timestamp = Date.now(),
  randomHex = randomBytes(6).toString("hex"),
): string {
  const ext =
    EXT_BY_MIME[mimeType] ||
    (originalFilename?.match(/\.[a-z0-9]+$/i)?.[0]?.toLowerCase() ?? ".jpg");
  return `products/${timestamp}-${randomHex}${ext}`;
}

export async function uploadImageToObjectStorage(
  buffer: Buffer,
  mimeType: string,
  originalFilename?: string,
): Promise<string> {
  const key = objectKeyForUpload(mimeType, originalFilename);
  const client = getS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: getBucket(),
      Key: key,
      Body: buffer,
      ContentType: mimeType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );

  return publicObjectUrl(key);
}
