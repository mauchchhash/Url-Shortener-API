import { Types } from "mongoose";
import ShortUrl from "../database/models/ShortUrlModel";
import appAssert from "../utils/appAssert";
import { SC } from "../utils/http";
import ShortUrlRepository from "../repository/ShortUrlRepository";

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

export const paginatedGet = async (userId: Types.ObjectId, page: number = 1, perPage: number = 20) => {
  const repo = new ShortUrlRepository();
  const shortUrls = await repo.paginatedFind({ userId }, page, perPage);
  appAssert(Array.isArray(shortUrls), "Couldn't get shorturls", SC.INTERNAL_SERVER_ERROR);
  return shortUrls;
};

export const createShortUrl = async (userId: Types.ObjectId, longUrl: string) => {
  const repo = new ShortUrlRepository();
  const totalUrls = await repo.countDocuments();
  const shortUrlSegment = numToShortUrlString(totalUrls + 1) as string;
  const newShortUrl = await repo.create({ userId, shortUrlSegment, longUrl: longUrl, createdAt: new Date() });
  appAssert(newShortUrl instanceof ShortUrl, "ShortUrl couldn't be created", SC.INTERNAL_SERVER_ERROR);
  return newShortUrl;
};

export const deleteShortUrl = async (userId: Types.ObjectId, shortUrlId: string | Types.ObjectId) => {
  const repo = new ShortUrlRepository();
  const deleteResult = await repo.findOneAndDelete({ userId, _id: shortUrlId });
  appAssert(deleteResult instanceof ShortUrl, "shortUrlId not valid", SC.BAD_REQUEST);
  return deleteResult;
};

export default {
  paginatedGet,
  createShortUrl,
  deleteShortUrl,
};
