import { RequestHandler } from "express";
import User from "../database/models/UserModel";
import { validateLoginRequest, validateRegisterRequest } from "../validation/authValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configKeys from "../config/keys";

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

  const accessToken = jwt.sign(
    { _id: existingUser._id, tokenCreatedAt: new Date().toISOString() },
    configKeys.accessTokenSecret,
  );

  res.status(200).json({ success: true, message: "User Logged in", accessToken });
};

export default {
  register,
  login,
};
