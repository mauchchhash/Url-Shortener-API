import assert from "node:assert";
import AppError from "./AppError";
import { HttpStatusCode } from "./http";
import appErrorCode from "./appErrorCode";

type appAssertType = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any,
  httpStatusCode: HttpStatusCode,
  errorMessage: string,
  errorCode?: appErrorCode,
) => asserts condition;

const appAssert: appAssertType = (condition, httpStatusCode, errorMessage, errorCode) =>
  assert(condition, new AppError(httpStatusCode, errorMessage, errorCode));

export default appAssert;
