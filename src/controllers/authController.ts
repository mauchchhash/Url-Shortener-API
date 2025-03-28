import { RequestHandler } from "express";
import User from "../database/models/UserModel";
import { validateRegisterRequest } from "../validation/authValidator";
import bcrypt from "bcrypt";

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

export default {
  register,
};
