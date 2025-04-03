import { RequestHandler } from "express";
import User from "../database/models/UserModel";
import { validateLoginRequest, validateRegisterRequest } from "../validation/authValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configKeys from "../config/keys";
import redisClient from "../redisClientSetup";
import configConstants from "../config/constants";
import { generateAccessTokenForUser } from "../utils/auth";
import { isNotTestEnv } from "../utils/helpers";
import catchErrors from "../utils/catchErrors";
import { SC } from "../utils/http";

const register: RequestHandler = catchErrors(async (req, res) => {
  const reqData = req?.body;
  const { validationSuccess, validatedData: data, validationError } = validateRegisterRequest(reqData);

  if (!validationSuccess || data == null) {
    res.status(SC.UNPROCESSABLE_CONTENT).json({ message: "Invalid Input", _errors: validationError?.format() });
    return;
  }

  const existingUser = await User.findOne({ email: data?.email }).exec();
  if (existingUser) {
    res.status(SC.UNPROCESSABLE_CONTENT).json({
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

  res.status(SC.CREATED).json({ success: true, message: "User registered", createdUserId: createdUser?._id });
});

const login: RequestHandler = catchErrors(async (req, res) => {
  const reqData = req?.body;
  const { validationSuccess, validatedData: data } = validateLoginRequest(reqData);

  if (!validationSuccess || data == null) {
    res.status(SC.UNPROCESSABLE_CONTENT).json({ message: "Invalid Input" });
    return;
  }

  const existingUser = await User.findOne({ email: data?.email }).exec();
  if (!existingUser) {
    res.status(SC.UNAUTHORIZED).json({ message: "Email or Password is not correct" });
    return;
  }

  if ((await bcrypt.compare(data?.password, existingUser?.password)) === false) {
    res.status(SC.UNAUTHORIZED).json({ message: "Email or Password is not correct" });
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
  redisClient.set(
    "refreshToken:" + refreshToken,
    existingUser._id.toString(),
    "EX",
    (configConstants.refreshTokenValidityInDays + 1) * 24 * 60 * 60,
  );

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isNotTestEnv(),
      sameSite: "strict",
      path: "/api/auth/getNewAccessToken",
      maxAge: configConstants.refreshTokenValidityInDays * 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isNotTestEnv(),
      sameSite: "strict",
      path: "/api/logout",
      maxAge: configConstants.refreshTokenValidityInDays * 24 * 60 * 60 * 1000,
    });
  res.status(SC.OK).json({ success: true, message: "User Logged in", accessToken, expiresAt });
});

const logout: RequestHandler = catchErrors(async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || typeof authHeader != "string") {
    res.status(SC.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken || typeof refreshToken != "string") {
    res.status(SC.UNPROCESSABLE_CONTENT).json({ success: false, message: "No refreshToken provided" });
    return;
  }

  const [tokenType, accessToken] = authHeader.split(" ");
  if (tokenType != "Bearer") {
    res.status(SC.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const isCachedRefreshToken = await redisClient.get("refreshToken:" + refreshToken);
  if (!isCachedRefreshToken) {
    res.status(SC.UNPROCESSABLE_CONTENT).json({ success: false, message: "Invalid refresh Token" });
    return;
  }

  await redisClient.set(
    "blockedAccessToken:" + accessToken,
    req?.authUserId?.toString() ?? isCachedRefreshToken,
    "EX",
    (configConstants.accessTokenValidityInMinutes + 1) * 60,
  );
  await redisClient.del("refreshToken:" + refreshToken);
  res
    .clearCookie("refreshToken", {
      path: "/api/auth/getNewAccessToken",
    })
    .clearCookie("refreshToken", {
      path: "/api/logout",
    });
  res.status(SC.NO_CONTENT).json({ success: true, message: "Logged out" });
});

const getNewAccessToken: RequestHandler = catchErrors(async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(SC.UNPROCESSABLE_CONTENT).json({ success: false, message: "Token not provided" });
    return;
  }

  const cachedResult = await redisClient.get("refreshToken:" + refreshToken);
  const refreshTokenFound = !!cachedResult;
  if (!refreshTokenFound) {
    res.status(SC.FORBIDDEN).json({ success: false, message: "Invalid Token" });
    return;
  }

  const authHeader = req.headers["authorization"];
  if (authHeader && typeof authHeader == "string") {
    const [tokenType, accessToken] = authHeader.split(" ");
    if (tokenType == "Bearer" && accessToken && typeof accessToken == "string") {
      await redisClient.set(
        "blockedAccessToken:" + accessToken,
        req?.authUserId?.toString() ?? cachedResult,
        "EX",
        (configConstants.accessTokenValidityInMinutes + 1) * 60,
      );
    }
  }

  const decodedData = <{ _id: string } & object>jwt.verify(refreshToken, configKeys.refreshTokenSecret);
  const userId = decodedData?._id;
  const user = await User.findOne({ _id: userId }).exec();
  if (!user) {
    res.status(SC.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    return;
  }

  const { accessToken, expiresAt } = generateAccessTokenForUser(
    user,
    configKeys.accessTokenSecret,
    configConstants.accessTokenValidityInMinutes,
  );

  res.status(SC.OK).json({ success: true, message: "Token Refreshed", accessToken, expiresAt });
});

export default {
  register,
  login,
  logout,
  getNewAccessToken,
};
