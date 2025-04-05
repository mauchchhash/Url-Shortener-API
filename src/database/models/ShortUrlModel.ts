import mongoose, { Document } from "mongoose";

export interface IShortUrl extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  longUrl: "string";
  shortUrlSegment: "string";
  createdAt: Date;
}

const shortUrlSchema = new mongoose.Schema<IShortUrl>({
  userId: {
    ref: "User",
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    index: true,
  },
  shortUrlSegment: {
    type: String,
    unique: true,
    required: true,
  },
  longUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const ShortUrl = mongoose.model<IShortUrl>("Url", shortUrlSchema);
export default ShortUrl;
