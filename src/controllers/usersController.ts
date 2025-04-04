import { RequestHandler } from "express";
import userRTO from "../rto/userRTO";
import { setAuthUserToRequest } from "../utils/auth";
import catchErrors from "../utils/catchErrors";
import { SC } from "../utils/http";
import appAssert from "../utils/appAssert";

const getOwnProfileInfo: RequestHandler = catchErrors(async (req, res) => {
  appAssert(req.authUserId, "UserId not found in request object", 500);

  const authUser = req.authUser ?? (await setAuthUserToRequest(req, req.authUserId));
  appAssert(authUser, "User not found", 404);
  res.status(SC.OK).json({ success: true, data: userRTO(authUser) });
});

export default {
  getOwnProfileInfo,
};
