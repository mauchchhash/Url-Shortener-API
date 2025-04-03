import { RequestHandler } from "express";

const catchErrors = (reqHandler: RequestHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      await reqHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

export default catchErrors;
