import appErrorCode from "./appErrorCode";
import { HttpStatusCode } from "./http";

class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public message: string,
    public errorCode: appErrorCode = appErrorCode.Unspecified,
  ) {
    super(message);
  }
}

export default AppError;
