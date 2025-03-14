import express from "express";
import dotEnv from "dotenv";
import apiRouter from "./routes/api";
import webRouter from "./routes/web";
import beforeMiddlewares from "./middleware/beforeMiddlewares";

dotEnv.config();
const app = express();
app.use(express.json());

app.use(beforeMiddlewares);
app.use(apiRouter);
app.use(webRouter);

export default app;
