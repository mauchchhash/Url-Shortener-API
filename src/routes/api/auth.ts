import { Router } from "express";
import authController from "../../controllers/authController";

const authRouter = Router();
authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);

export default authRouter;
