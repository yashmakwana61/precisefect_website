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
import systemRouter from "./system";
import leadsRouter from "./leads";
import automationRouter from "./automation";
import tasksRouter from "./tasks";
import integrationsRouter from "./integrations";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(systemRouter);
router.use(automationRouter);
router.use(integrationsRouter);
router.use(tasksRouter);
router.use(leadsRouter);
router.use(collectionsRouter);
router.use(seoRouter);
router.use(settingsRouter);
router.use(sitemapRouter);
router.use(revisionsRouter);
router.use(assetsRouter);
router.use(siteBlocksRouter);
router.use(sitePagesRouter);

export default router;
