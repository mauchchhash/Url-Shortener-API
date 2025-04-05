import User, { IUser } from "../src/database/models/UserModel";
import app from "../src/createApp";
import request from "supertest";
import bcrypt from "bcrypt";
import { SC } from "../src/utils/http";
import { Types } from "mongoose";
import ShortUrl from "../src/database/models/ShortUrlModel";

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

  test("post: user can create short urls", async () => {
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

  test("post: invlalid longUrl will throw 422 error", async () => {
    const rs = await request(app)
      .post("/api/shortUrls")
      .set("Authorization", "Bearer " + accessToken)
      .send({ url: "invalid_url" });
    expect(rs.statusCode).toBe(SC.UNPROCESSABLE_CONTENT);
  });

  test("delete: user can delete a short url", async () => {
    const createResponse = await request(app)
      .post("/api/shortUrls")
      .set("Authorization", "Bearer " + accessToken)
      .send({ url: "https://www.google.com" });
    const shortUrl = createResponse.body.shortUrl;
    const deleteResponse = await request(app)
      .delete("/api/shortUrls/" + shortUrl._id)
      .set("Authorization", "Bearer " + accessToken);
    expect(deleteResponse.statusCode).toBe(SC.NO_CONTENT);
    expect(await ShortUrl.findOne({ longUrl: "https://www.google.com" }).exec()).toBe(null);
  });

  test("delete: user can't delete a short url that doen't exist", async () => {
    const deleteResponse = await request(app)
      .delete("/api/shortUrls/" + "67f14ff453c4a8378d08aed7")
      .set("Authorization", "Bearer " + accessToken);
    expect(deleteResponse.statusCode).toBe(SC.BAD_REQUEST);
  });

  test("delete: user can't delete a short url that doen't belong to him", async () => {
    const dummyShortUrl = await ShortUrl.create({
      userId: new Types.ObjectId("67f14ff453c4a8378d08aed7"),
      shortUrlSegment: "abc",
      longUrl: "https://google.com",
      createdAt: Date.now(),
    });

    const deleteResponse = await request(app)
      .delete("/api/shortUrls/" + dummyShortUrl._id)
      .set("Authorization", "Bearer " + accessToken);
    expect(deleteResponse.statusCode).toBe(SC.BAD_REQUEST);
  });
});
