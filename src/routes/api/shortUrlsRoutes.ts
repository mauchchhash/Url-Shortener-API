import { Router } from "express";
import authMiddleware from "../../middleware/authMiddleware";
import shortUrlsController from "../../controllers/shortUrlsController";

const shortUrlsRouter = Router();
shortUrlsRouter.get("/", authMiddleware, shortUrlsController.paginatedGet);
shortUrlsRouter.post("/", authMiddleware, shortUrlsController.create);
shortUrlsRouter.delete("/:shortUrlId", authMiddleware, shortUrlsController.deleteShortUrl);

export default shortUrlsRouter;
