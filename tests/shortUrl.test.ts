import User, { IUser } from "../src/database/models/UserModel";
import app from "../src/createApp";
import request from "supertest";
import bcrypt from "bcrypt";
import { SC } from "../src/utils/http";
import mongoose from "mongoose";

describe("Short Url Suite", () => {
  let accessToken: string = "";
  let user: IUser | undefined;

  beforeEach(async () => {
    user = await User.create({
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

  test("user can create short urls", async () => {
    const rs = await request(app)
      .post("/api/shortUrls")
      .set("Authorization", "Bearer " + accessToken)
      .send({ url: "https://www.google.com" });
    expect(rs.statusCode).toBe(SC.CREATED);
    expect(rs.body.shortUrl).toBeDefined();
    expect(rs.body.shortUrl).toBeInstanceOf(Object);
    expect(rs.body.shortUrl.longUrl).toBe("https://www.google.com");
    expect(rs.body.shortUrl.shortUrlSegment).toBeDefined();
    expect(typeof rs.body.shortUrl.shortUrlSegment).toBe("string");
  });
});
