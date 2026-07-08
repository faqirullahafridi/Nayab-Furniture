import "./load-env.js";
import app from "./app";
import { logger } from "./lib/logger";
import { isObjectStorageConfigured } from "./lib/object-storage";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info(
    {
      port,
      imageStorage: isObjectStorageConfigured() ? "supabase-s3" : "local",
      bucket: process.env.S3_BUCKET ?? "uploads",
    },
    "Server listening",
  );
});
