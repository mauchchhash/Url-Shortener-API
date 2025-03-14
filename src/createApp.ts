import express from "express";
import apiRouter from "./routes/api";
import webRouter from "./routes/web";
import beforeMiddlewares from "./middleware/beforeMiddlewares";
import { connectWithDb } from "./mongo";

//console.log({ env: process.env });
const app = express();
app.use(express.json());

app.use(beforeMiddlewares);
app.use(apiRouter);
app.use(webRouter);

connectWithDb();

export default app;
