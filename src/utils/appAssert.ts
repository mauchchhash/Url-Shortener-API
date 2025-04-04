import assert from "node:assert";
import AppError from "./AppError";
import { HttpStatusCode } from "./http";
import appErrorCode from "./appErrorCode";

type appAssertType = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  condition: any,
  errorMessage: string,
  httpStatusCode: HttpStatusCode,
  errorCode?: appErrorCode,
) => asserts condition;

const appAssert: appAssertType = (condition, errorMessage, httpStatusCode, errorCode) =>
  assert(condition, new AppError(errorMessage, httpStatusCode, errorCode));

export default appAssert;
