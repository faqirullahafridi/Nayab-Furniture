import https from "node:https";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

const tlsInsecure = process.env.S3_TLS_INSECURE === "true";
const client = new S3Client({
  region: process.env.S3_REGION || "ap-northeast-1",
  endpoint: process.env.S3_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  requestHandler: new NodeHttpHandler({
    httpsAgent: new https.Agent({
      keepAlive: true,
      rejectUnauthorized: !tlsInsecure,
    }),
  }),
});

const key = `products/test-${Date.now()}.png`;
const body = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

await client.send(
  new PutObjectCommand({
    Bucket: process.env.S3_BUCKET || "uploads",
    Key: key,
    Body: body,
    ContentType: "image/png",
  }),
);

const url = `${process.env.SUPABASE_URL}/storage/v1/object/public/${process.env.S3_BUCKET || "uploads"}/${key}`;
console.log("S3_UPLOAD_OK", url);
