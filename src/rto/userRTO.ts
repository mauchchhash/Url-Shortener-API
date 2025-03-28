import { IUser } from "../database/models/UserModel";

const userRTO = (user: IUser) => {
  return {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    createdAt: user.createdAt,
  };
};
export default userRTO;
