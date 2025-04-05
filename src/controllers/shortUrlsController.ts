import { RequestHandler } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { SC } from "../utils/http";
import appErrorCode from "../utils/appErrorCode";
import { z } from "zod";
import shortUrlService from "../services/shortUrlService";

const create: RequestHandler = catchErrors(async (req, res) => {
  appAssert(req.authUserId, "UserId not found in request object", 500);
  appAssert(req.body.url, "Url not privided", SC.BAD_REQUEST, appErrorCode.UrlNotProvided);

  const url = z.string().url().parse(req.body.url);

  const shortUrl = await shortUrlService.createShortUrl(req.authUserId, url);

  res.status(SC.CREATED).json({ success: true, shortUrl });
});

const deleteShortUrl: RequestHandler = catchErrors(async (req, res) => {
  const shortUrlId = req.params.shortUrlId;
  appAssert(req.authUserId, "UserId not found in request object", 500);
  await shortUrlService.deleteShortUrl(req.authUserId, shortUrlId);
  res.status(SC.NO_CONTENT).json({ success: true });
});

export default {
  create,
  deleteShortUrl,
};
