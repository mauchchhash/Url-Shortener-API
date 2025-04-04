import appErrorCode from "./appErrorCode";
import { HttpStatusCode } from "./http";

class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: HttpStatusCode,
    public errorCode: appErrorCode = appErrorCode.Unspecified,
  ) {
    super(message);
  }
}

export default AppError;
