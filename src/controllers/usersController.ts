import { RequestHandler } from "express";
import userRTO from "../rto/userRTO";

const getOwnProfileInfo: RequestHandler = async (req, res) => {
  const authUser = req.authUser;
  if (!authUser) {
    res.status(500).json({ success: false });
    return;
  }
  res.status(200).json({ success: true, data: userRTO(authUser) });
};

export default {
  getOwnProfileInfo,
};
