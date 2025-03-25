import { RequestHandler } from "express";
import { isNotTestEnv } from "../helpers";

const logReqInfo: RequestHandler = (req, _, next) => {
  console.log("-------------------------------------------------------------------------------------------------");
  console.log(`${req.method} -- ${req.url}`);
  next();
};

const beforeMiddlewares: Array<RequestHandler> = [];

if (isNotTestEnv()) {
  beforeMiddlewares.push(logReqInfo);
}

export default beforeMiddlewares;
