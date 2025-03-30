import express from "express";
import apiRouter from "./routes/api";
import webRouter from "./routes/web";
import beforeMiddlewares from "./middleware/beforeMiddlewares";
import { connectToDB } from "./database/setup/database";
import cors from "cors";
import configKeys from "./config/keys";

const app = express();
app.use(
  cors({
    origin: configKeys.allowedOriginForCors,
  }),
);
app.use(express.json());

if (beforeMiddlewares.length) {
  app.use(beforeMiddlewares);
}

app.use(apiRouter);
app.use(webRouter);

connectToDB();

export default app;
