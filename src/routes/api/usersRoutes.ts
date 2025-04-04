import { Router } from "express";
import usersController from "../../controllers/usersController";
import authMiddleware from "../../middleware/authMiddleware";

const usersRouter = Router();
usersRouter.get("/users/me", authMiddleware, usersController.getOwnProfileInfo);

export default usersRouter;
