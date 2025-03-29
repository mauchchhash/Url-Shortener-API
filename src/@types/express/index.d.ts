import mongoose from "mongoose";
import { IUser } from "../../database/models/UserModel";
declare global {
  namespace Express {
    interface Request {
      authUserId?: mongoose.Types.ObjectId;
      authUser?: IUser;
    }
  }
}
