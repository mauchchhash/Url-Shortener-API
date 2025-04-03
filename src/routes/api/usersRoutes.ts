import { Router } from "express";
import usersController from "../../controllers/usersController";
import authMiddleware from "../../middleware/authMiddleware";

const usersRouter = Router();
usersRouter.use(authMiddleware);
usersRouter.get("/users/me", usersController.getOwnProfileInfo);

export default usersRouter;
