import { Router } from "express";
import authRouter from "./authRoutes";
import usersRouter from "./usersRoutes";
import shortUrlsRouter from "./shortUrlsRoutes";

const apiRouter = Router();
apiRouter.use("/api", authRouter);
apiRouter.use("/api/users", usersRouter);
apiRouter.use("/api/shortUrls", shortUrlsRouter);

export default apiRouter;
