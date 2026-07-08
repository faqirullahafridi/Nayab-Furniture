import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import galleryRouter from "./gallery";
import inquiriesRouter from "./inquiries";
import adminRouter from "./admin";
import uploadsRouter from "./uploads";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(galleryRouter);
router.use(inquiriesRouter);
router.use(adminRouter);
router.use(uploadsRouter);

export default router;
