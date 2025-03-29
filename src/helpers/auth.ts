import { Request } from "express";
import User, { IUser } from "../database/models/UserModel";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateAccessTokenForUser = (
  user: IUser,
  accessTokenSecret: string,
  accessTokenValidityInMinutes: number,
) => {
  const accessToken = jwt.sign({ _id: user._id, tokenCreatedAt: new Date().toISOString() }, accessTokenSecret, {
    expiresIn: accessTokenValidityInMinutes * 60,
  });
  const expiresAt = new Date().getTime() + accessTokenValidityInMinutes * 60 * 1000;
  return { accessToken, expiresAt };
};

export const setAuthUserToRequest = async (req: Request, userId: Types.ObjectId | string) => {
  const user = await User.findOne({ _id: userId });
  if (!user) throw new Error("User Not Found");
  if (user) {
    req.authUser = user;
  }
  return req.authUser;
};
