import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import configKeys from "../config/keys";
import mongoose from "mongoose";
import redisClient from "../redisClientSetup";
import { SC } from "../utils/http";

const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || typeof authHeader != "string") {
    res.status(SC.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }
  const [tokenType, accessToken] = authHeader.split(" ");
  if (tokenType != "Bearer" || !accessToken) {
    res.status(SC.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const isBlockedAccessToken = await redisClient.get("blockedAccessToken:" + accessToken);
  if (isBlockedAccessToken) {
    res.status(SC.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const decodedData = <{ _id: string } & object>jwt.verify(accessToken, configKeys.accessTokenSecret);
    const userId = decodedData?._id;
    req.authUserId = new mongoose.Types.ObjectId(userId);
    next();
  } catch (_err) {
    res.status(SC.FORBIDDEN).json({ success: false, message: "Token expired" });
  }
};

export default authMiddleware;
