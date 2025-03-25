import { Router } from "express";
import authRouter from "./auth";

const apiRouter = Router();
apiRouter.use(authRouter);

export default apiRouter;
