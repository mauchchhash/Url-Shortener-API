import { RequestHandler } from "express";
import User from "../database/models/UserModel";
import { validateLoginRequest, validateRegisterRequest } from "../validation/authValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configKeys from "../config/keys";
import redisClient from "../redisClientSetup";
import configConstants from "../config/constants";
import { generateAccessTokenForUser } from "../helpers/auth";
import { isNotTestEnv } from "../helpers";

const register: RequestHandler = async (req, res) => {
  const reqData = req?.body;
  const { validationSuccess, validatedData: data, validationError } = validateRegisterRequest(reqData);

  if (!validationSuccess || data == null) {
    res.status(422).json({ message: "Invalid Input", _errors: validationError?.format() });
    return;
  }

  const existingUser = await User.findOne({ email: data?.email }).exec();
  if (existingUser) {
    res.status(422).json({
      message: "Email already registered",
      _errors: {
        email: {
          _errors: ["Email already in use"],
        },
      },
    });
    return;
  }

  const hashedPassword = await bcrypt.hash(data?.password, 10);
  const createdUser = await User.create({
    fullname: data?.fullname,
    email: data?.email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  res.status(201).json({ success: true, message: "User registered", createdUserId: createdUser?._id });
};

const login: RequestHandler = async (req, res) => {
  const reqData = req?.body;
  const { validationSuccess, validatedData: data } = validateLoginRequest(reqData);

  if (!validationSuccess || data == null) {
    res.status(422).json({ message: "Invalid Input" });
    return;
  }

  const existingUser = await User.findOne({ email: data?.email }).exec();
  if (!existingUser) {
    res.status(401).json({ message: "Email or Password is not correct" });
    return;
  }

  if ((await bcrypt.compare(data?.password, existingUser?.password)) === false) {
    res.status(401).json({ message: "Email or Password is not correct" });
    return;
  }

  const { accessToken, expiresAt } = generateAccessTokenForUser(
    existingUser,
    configKeys.accessTokenSecret,
    configConstants.accessTokenValidityInMinutes,
  );

  const refreshToken = jwt.sign(
    { _id: existingUser._id, tokenCreatedAt: new Date().toISOString() },
    configKeys.refreshTokenSecret,
  );
  redisClient.set("refreshToken:" + refreshToken, existingUser._id.toString());

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isNotTestEnv(), // Secure only in production
    // sameSite: "Strict",
    path: "/auth/getNewAccessToken",
    maxAge: configConstants.refreshTokenValidityInDays * 24 * 60 * 60 * 1000,
  });
  res.status(200).json({ success: true, message: "User Logged in", accessToken, expiresAt });
};

const logout: RequestHandler = async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || typeof authHeader != "string") {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken || typeof refreshToken != "string") {
    console.log(2);
    res.status(422).json({ success: false, message: "No refreshToken provided" });
    return;
  }

  const [tokenType, accessToken] = authHeader.split(" ");
  if (tokenType != "Bearer") {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const isCachedRefreshToken = await redisClient.get("refreshToken:" + refreshToken);
  if (!isCachedRefreshToken) {
    res.status(422).json({ success: false, message: "Invalid refresh Token" });
    return;
  }

  await redisClient.set(
    "blockedAccessToken:" + accessToken,
    req?.authUserId?.toString() ?? isCachedRefreshToken,
    "EX",
    (configConstants.accessTokenValidityInMinutes + 1) * 60,
  );
  await redisClient.del("refreshToken:" + refreshToken);
  res.status(204).json({ success: true, message: "Logged out" });
};

const getNewAccessToken: RequestHandler = async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(422).json({ success: false, message: "Token not provided" });
    return;
  }

  const refreshTokenFound = !!(await redisClient.get("refreshToken:" + refreshToken));
  if (!refreshTokenFound) {
    res.status(403).json({ success: false, message: "Invalid Token" });
    return;
  }

  const decodedData = <{ _id: string } & object>jwt.verify(refreshToken, configKeys.refreshTokenSecret);
  const userId = decodedData?._id;
  const user = await User.findOne({ _id: userId }).exec();
  if (!user) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const { accessToken, expiresAt } = generateAccessTokenForUser(
    user,
    configKeys.accessTokenSecret,
    configConstants.accessTokenValidityInMinutes,
  );

  res.status(200).json({ success: true, message: "Token Refreshed", accessToken, expiresAt });
};

export default {
  register,
  login,
  logout,
  getNewAccessToken,
};
