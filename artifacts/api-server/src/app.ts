import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import router from "./routes";
import { logger } from "./lib/logger";
import { authMiddleware } from "./middlewares/authMiddleware";

const app: Express = express();
const moduleDir = path.dirname(fileURLToPath(import.meta.url));

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
app.use(cors({ credentials: true, origin: true }));
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);

app.use("/api", router);

const staticRoot =
  process.env.STATIC_ROOT ?? path.join(moduleDir, "public");

const staticIndex = path.join(staticRoot, "index.html");

if (fs.existsSync(staticIndex)) {
  logger.info({ staticRoot }, "Serving Precisefect static build");
  app.use(express.static(staticRoot, { index: false }));
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(staticIndex);
  });
} else {
  logger.warn(
    { staticRoot, staticIndex },
    "Precisefect static build not found; only /api routes are available",
  );
}

export default app;
