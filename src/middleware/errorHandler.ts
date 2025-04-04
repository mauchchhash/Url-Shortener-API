import { ErrorRequestHandler, Response } from "express";
import { z } from "zod";
import { SC } from "../utils/http";
import AppError from "../utils/AppError";

const handleZodError = (err: z.ZodError, res: Response) => {
  res.status(SC.UNPROCESSABLE_CONTENT).json({
    message: "Invalid data",
    _errors: err.format(),
  });
};

const handleAppError = (err: AppError, res: Response) => {
  res.status(err.statusCode).json({
    message: err.message,
    errorCode: err.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // console.log(`PATH: ${req.path}`, err);

  if (err instanceof z.ZodError) {
    handleZodError(err, res);
    return;
  }

  if (err instanceof AppError) {
    handleAppError(err, res);
    return;
  }

  res.status(SC.INTERNAL_SERVER_ERROR).send("Something went wrong");
};

export default errorHandler;
