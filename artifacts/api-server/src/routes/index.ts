import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import collectionsRouter from "./collections";
import seoRouter from "./seo";
import settingsRouter from "./settings";
import sitemapRouter from "./sitemap";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(collectionsRouter);
router.use(seoRouter);
router.use(settingsRouter);
router.use(sitemapRouter);

export default router;
