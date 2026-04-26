import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import collectionsRouter from "./collections";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(collectionsRouter);

export default router;
