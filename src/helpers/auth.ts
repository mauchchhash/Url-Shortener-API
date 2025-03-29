import { IUser } from "../database/models/UserModel";
import jwt from "jsonwebtoken";

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
