import { Router } from "express";
import authRouter from "./authRoutes";
import usersRouter from "./usersRoutes";

const apiRouter = Router();
apiRouter.use("/api", authRouter);
apiRouter.use("/api", usersRouter);

export default apiRouter;
