const enum appErrorCode {
  InvalidAccessToken = "InvalidAccessToken",
  InvalidRefreshToken = "InvalidRefreshToken",
  UserNotFound = "UserNotFound",
  EmailInUse = "EmailInUse",
  Unspecified = "Unspecified",
  WrongEmailOrPassword = "WrongEmailOrPassword",
  NoAuthHeader = "NoAuthHeader",
  NoRefreshToken = "NoRefreshToken",
  NoBearerToken = "NoBearerToken",
  UrlNotProvided = "UrlNotProvided",
}

export default appErrorCode;
