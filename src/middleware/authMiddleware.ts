import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import configKeys from "../config/keys";
import mongoose from "mongoose";
import redisClient from "../redisClientSetup";
import { SC } from "../utils/http";
import appAssert from "../utils/appAssert";
import appErrorCode from "../utils/appErrorCode";
import catchErrors from "../utils/catchErrors";
import AppError from "../utils/AppError";

const authMiddleware: RequestHandler = catchErrors(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  appAssert(authHeader && typeof authHeader == "string", "No authorization header provided", SC.UNAUTHORIZED, appErrorCode.NoAuthHeader);

  const [tokenType, accessToken] = authHeader.split(" ");
  appAssert(tokenType == "Bearer", "No Bearer Token provided", SC.UNAUTHORIZED, appErrorCode.NoBearerToken);

  const isBlockedAccessToken = await redisClient.get("blockedAccessToken:" + accessToken);
  appAssert(!isBlockedAccessToken, "Unauthorized", SC.UNAUTHORIZED, appErrorCode.InvalidAccessToken);

  try {
    const decodedData = <{ _id: string } & object>jwt.verify(accessToken, configKeys.accessTokenSecret);
    const userId = decodedData?._id;
    req.authUserId = new mongoose.Types.ObjectId(userId);
    next();
  } catch (_err) {
    throw new AppError("Access token not valid or expired", SC.UNAUTHORIZED, appErrorCode.InvalidAccessToken);
  }
});

export default authMiddleware;
