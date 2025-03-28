import mongoose, { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId;
  fullname: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  // _id: {
  //   type: mongoose.Types.ObjectId,
  //   required: false,
  // },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
