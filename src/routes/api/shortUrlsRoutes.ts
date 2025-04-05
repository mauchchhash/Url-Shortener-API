import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import shortUrlsController from "../../controllers/shortUrlsController";

const shortUrlsRouter = Router();
shortUrlsRouter.post("/", authMiddleware, shortUrlsController.create);

export default shortUrlsRouter;
