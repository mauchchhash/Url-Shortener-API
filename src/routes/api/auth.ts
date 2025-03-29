import { Router } from "express";
import authController from "../../controllers/authController";

const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/auth/getNewAccessToken", authController.getNewAccessToken);

export default authRouter;
