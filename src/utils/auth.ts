import { Request } from "express";
import User, { IUser } from "../database/models/UserModel";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { Response } from "supertest";
import { minutesToMilliseconds, minutesToSeconds, nMinutesFromNow } from "./date";

export const generateAccessTokenForUser = (
  user: IUser,
  accessTokenSecret: string,
  accessTokenValidityInMinutes: number,
) => {
  const accessToken = jwt.sign({ _id: user._id, tokenCreatedAt: new Date().toISOString() }, accessTokenSecret, {
    expiresIn: minutesToSeconds(accessTokenValidityInMinutes),
  });
  const expiresAt = nMinutesFromNow(accessTokenValidityInMinutes);
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

export const getRefreshTokenFromSuperTestResponse = (response: Response) => {
  const cookies = response.headers["set-cookie"];
  return Array.isArray(cookies)
    ? cookies
        .find((c) => c.startsWith("refreshToken="))
        .slice("refreshToken=".length)
        .split(";")[0]
    : undefined;
};
