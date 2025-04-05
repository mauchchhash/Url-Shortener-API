import { Types } from "mongoose";
import ShortUrl from "../database/models/ShortUrlModel";

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
  return newShortUrl;
};

export default {
  createShortUrl,
};
