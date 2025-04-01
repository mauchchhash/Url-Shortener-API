import { RequestHandler } from "express";
import userRTO from "../rto/userRTO";
import { setAuthUserToRequest } from "../utils/auth";

const getOwnProfileInfo: RequestHandler = async (req, res) => {
  if (!req.authUserId) {
    res.status(500).json({ success: false });
    return;
  }

  const authUser = req.authUser ?? (await setAuthUserToRequest(req, req.authUserId));
  if (!authUser) {
    res.status(500).json({ success: false });
    return;
  }
  res.status(200).json({ success: true, data: userRTO(authUser) });
};

export default {
  getOwnProfileInfo,
};
