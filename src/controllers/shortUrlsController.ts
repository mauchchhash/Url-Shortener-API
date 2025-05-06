import { RequestHandler } from "express";
import catchErrors from "../utils/catchErrors";
import appAssert from "../utils/appAssert";
import { SC } from "../utils/http";
import appErrorCode from "../utils/appErrorCode";
import { z } from "zod";
import shortUrlService from "../services/shortUrlService";
import configConstants from "../config/constants";

const paginatedGet: RequestHandler = catchErrors(async (req, res) => {
  appAssert(req.authUserId, "UserId not found in request object", SC.INTERNAL_SERVER_ERROR);

  const page = +(req.query.page ?? "1");
  appAssert(page >= 1, "Page number can't be lower than 1", SC.BAD_REQUEST);

  const perPage = configConstants.paginatedPerPageRecords;
  const shortUrls = await shortUrlService.paginatedGet(req.authUserId, page, perPage);

  res.status(SC.OK).json({ success: true, shortUrls });
});

const create: RequestHandler = catchErrors(async (req, res) => {
  appAssert(req.authUserId, "UserId not found in request object", SC.INTERNAL_SERVER_ERROR);
  appAssert(req.body.url, "Url not privided", SC.BAD_REQUEST, appErrorCode.UrlNotProvided);

  const url = z.string().url().parse(req.body.url);

  const shortUrl = await shortUrlService.createShortUrl(req.authUserId, url);

  res.status(SC.CREATED).json({ success: true, shortUrl });
});

const deleteShortUrl: RequestHandler = catchErrors(async (req, res) => {
  const shortUrlId = req.params.shortUrlId;
  appAssert(req.authUserId, "UserId not found in request object", SC.INTERNAL_SERVER_ERROR);
  await shortUrlService.deleteShortUrl(req.authUserId, shortUrlId);
  res.status(SC.NO_CONTENT).json({ success: true });
});

export default {
  paginatedGet,
  create,
  deleteShortUrl,
};
