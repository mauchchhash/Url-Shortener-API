import { Types } from "mongoose";
import ShortUrl from "../database/models/ShortUrlModel";
import appAssert from "../utils/appAssert";
import { SC } from "../utils/http";

const numToShortUrlString = (num: number) => {
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const base = alphabets.length;
  let result = "";

  if (num === 0) {
    return alphabets[0];
  }

  let tempNum = num;
  while (tempNum > 0) {
    result = alphabets[tempNum % base] + result;
    tempNum = Math.floor(tempNum / base);
  }

  return result;
};

export const createShortUrl = async (userId: Types.ObjectId, longUrl: string) => {
  const totalUrls = await ShortUrl.countDocuments();
  const shortUrlSegment = numToShortUrlString(totalUrls + 1);
  const newShortUrl = await ShortUrl.create({ userId, shortUrlSegment, longUrl: longUrl, createdAt: Date.now() });
  appAssert(newShortUrl instanceof ShortUrl, "ShortUrl couldn't be created", SC.INTERNAL_SERVER_ERROR);
  return newShortUrl;
};

export const deleteShortUrl = async (userId: Types.ObjectId, shortUrlId: string | Types.ObjectId) => {
  const deleteResult = await ShortUrl.findOneAndDelete({ userId, _id: shortUrlId }).exec();
  appAssert(deleteResult instanceof ShortUrl, "shortUrlId not valid", SC.BAD_REQUEST);
  return deleteResult;
};

export default {
  createShortUrl,
  deleteShortUrl,
};
