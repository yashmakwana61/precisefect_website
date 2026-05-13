import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import collectionsRouter from "./collections";
import seoRouter from "./seo";
import settingsRouter from "./settings";
import sitemapRouter from "./sitemap";
import revisionsRouter from "./revisions";
import assetsRouter from "./assets";
import siteBlocksRouter from "./site-blocks";
import sitePagesRouter from "./site-pages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(collectionsRouter);
router.use(seoRouter);
router.use(settingsRouter);
router.use(sitemapRouter);
router.use(revisionsRouter);
router.use(assetsRouter);
router.use(siteBlocksRouter);
router.use(sitePagesRouter);

export default router;
