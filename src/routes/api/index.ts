import { Router } from "express";
import authRouter from "./auth";
import usersRouter from "./users";

const apiRouter = Router();
apiRouter.use("/api", authRouter);
apiRouter.use("/api", usersRouter);

export default apiRouter;
