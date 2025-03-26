import { RequestHandler } from "express";

const register: RequestHandler = (req, res) => {
  res.send("register");
};

export default {
  register,
};
