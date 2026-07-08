import "./load-env.js";
import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import router from "./routes";
import { logger } from "./lib/logger";
import { getUploadsServeDirs } from "./lib/uploads-dir";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
} from "./middlewares/clerkProxyMiddleware";
import { errorHandler } from "./middlewares/errorHandler";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

const clerkPublishableKey = publishableKeyFromHost(
  "",
  process.env.CLERK_PUBLISHABLE_KEY,
);

app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: clerkPublishableKey,
  }),
);

const uploadsDirs = getUploadsServeDirs();

app.use("/uploads", (req, res, next) => {
  let index = 0;

  const tryDir = (): void => {
    const dir = uploadsDirs[index++];
    if (!dir) {
      next();
      return;
    }

    express.static(dir, {
      maxAge: "7d",
      etag: true,
      lastModified: true,
      immutable: false,
      setHeaders(staticRes) {
        staticRes.setHeader(
          "Cache-Control",
          "public, max-age=604800, stale-while-revalidate=86400",
        );
      },
    })(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      if (res.headersSent) return;
      tryDir();
    });
  };

  tryDir();
});

app.use("/api", router);
app.use(errorHandler);

export default app;
