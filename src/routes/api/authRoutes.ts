import { Router } from "express";
import authController from "../../controllers/authController";
import authMiddleware from "../../middleware/authMiddleware";

const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/auth/getNewAccessToken", authController.getNewAccessToken);
authRouter.post("/logout", authMiddleware, authController.logout);

export default authRouter;
