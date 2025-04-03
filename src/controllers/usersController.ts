import { RequestHandler } from "express";
import userRTO from "../rto/userRTO";
import { setAuthUserToRequest } from "../utils/auth";
import catchErrors from "../utils/catchErrors";
import { SC } from "../utils/http";

const getOwnProfileInfo: RequestHandler = catchErrors(async (req, res) => {
  if (!req.authUserId) {
    res.status(SC.INTERNAL_SERVER_ERROR).json({ success: false });
    return;
  }

  const authUser = req.authUser ?? (await setAuthUserToRequest(req, req.authUserId));
  if (!authUser) {
    res.status(SC.INTERNAL_SERVER_ERROR).json({ success: false });
    return;
  }
  res.status(SC.OK).json({ success: true, data: userRTO(authUser) });
});

export default {
  getOwnProfileInfo,
};
