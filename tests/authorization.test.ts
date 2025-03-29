import request from "supertest";
import app from "../src/createApp";
import User, { IUser } from "../src/database/models/UserModel";
import bcrypt from "bcrypt";

describe("Authorization suite", () => {
  let accessToken: string = "";
  let expiresAt: number = 0;
  let refreshToken: string = "";
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
    expiresAt = loginResponse.body.expiresAt;
    refreshToken = loginResponse.body.refreshToken;
  });

  test("Authorization: user can fetch own's profile data with the accesstoken", async () => {
    const response = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer " + accessToken);
    expect(response?.body?.data?._id).toBe(defaultCreatedUser?._id?.toString());
  });

  test("Authorization: user can refresh his accesstoken", async () => {
    const response = await request(app).post("/api/auth/getNewAccessToken").send({ token: refreshToken });
    expect(response?.body?.accessToken).toBeDefined();
  });

  test("Authorization: new accessToken works perfectly", async () => {
    const response = await request(app).post("/api/auth/getNewAccessToken").send({ token: refreshToken });
    expect(response?.body?.accessToken).toBeDefined();
    const newAccessToken = response?.body?.accessToken;
    const response2 = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer " + newAccessToken);
    expect(response2?.body?.data?._id).toBe(defaultCreatedUser?._id?.toString());
  });
});
