import express from 'express'
import dotEnv from 'dotenv'
import apiRouter from './routes/api';

dotEnv.config();
const app = express();

app.use(apiRouter);

export default app;
