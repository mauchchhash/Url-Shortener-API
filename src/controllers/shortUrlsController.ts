import { RequestHandler } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { SC } from "../utils/http";
import appErrorCode from "../utils/appErrorCode";
import { z } from "zod";
import urlService from "../services/shortUrlService";

const create: RequestHandler = catchErrors(async (req, res) => {
  appAssert(req.authUserId, "UserId not found in request object", 500);
  appAssert(req.body.url, "Url not privided", SC.BAD_REQUEST, appErrorCode.UrlNotProvided);

  const url = z.string().url().parse(req.body.url);

  const shortUrl = await urlService.createShortUrl(req.authUserId, url);

  res.status(201).json({ success: true, shortUrl });
});

export default {
  create,
};
