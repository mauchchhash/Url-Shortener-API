import request from "supertest";
import app from "../src/createApp";
import User, { IUser } from "../src/database/models/UserModel";
import bcrypt from "bcrypt";

describe("Authorization suite", () => {
  let accessToken: string = "";
  let defaultCreatedUser: IUser | undefined;
  // ------------------------------------------------------
  // Authorization tests
  // ------------------------------------------------------

  beforeEach(async () => {
    defaultCreatedUser = await User.create({
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
    });
    const loginResponse = await request(app).post("/api/login").send({
      email: "johndoe@example.com",
      password: "password",
    });
    accessToken = loginResponse.body.accessToken;
  });

  test("Authorization: user can fetch own's profile data with the accesstoken", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer " + accessToken);
    expect(response?.body?.data?._id).toBe(defaultCreatedUser?._id?.toString());
  });
});
