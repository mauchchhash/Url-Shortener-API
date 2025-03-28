import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import configKeys from "../config/keys";
import User from "../database/models/UserModel";

const authMiddleware: RequestHandler = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || typeof authHeader != "string") {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  const [tokenType, accessToken] = authHeader.split(" ");
  if (tokenType != "Bearer") {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  try {
    const decodedData = <{ _id: string } & object>jwt.verify(accessToken, configKeys.accessTokenSecret);
    const userId = decodedData?._id;
    const user = await User.findOne({ _id: userId }).exec();
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    req.authUser = user;
    next();
  } catch (_err) {
    res.status(403).json({ success: false, message: "Token expired" });
  }
};

export default authMiddleware;
