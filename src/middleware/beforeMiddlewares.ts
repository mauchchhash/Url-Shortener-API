import { NextFunction, Request, Response } from "express";

function logReqInfo(req: Request, _: Response, next: NextFunction) {
  console.log("---------------------------------------------------------------------------------------------------------")
  console.log(`${req.method} -- ${req.url}`)
  next();
}

const beforeMiddlewares = [logReqInfo];

export default beforeMiddlewares;
