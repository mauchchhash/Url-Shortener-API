import request from "supertest";
import app from "../src/createApp";
import User, { IUser } from "../src/database/models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configKeys from "../src/config/keys";
import { getRefreshTokenFromSuperTestResponse } from "../src/utils/auth";
import { SC } from "../src/utils/http";
import appErrorCode from "./utils/appErrorCode";

describe("Authentication suite", () => {
  // ------------------------------------------------------
  // Registration tests
  // ------------------------------------------------------
  test("Register: valid input registers a user", async () => {
    const data = {
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const response = await request(app).post("/api/register").send(data);

    expect(response.statusCode).toEqual(SC.CREATED);
    expect(typeof response.body.createdUserId).not.toBeNull();

    const id = response.body.createdUserId;
    const dbUser = await User.findById({ _id: id }).exec();

    expect(dbUser).not.toBeNull();
    expect(dbUser?._id.toString()).toBe(id);
    expect(dbUser).toMatchObject({
      fullname: data?.fullname,
      email: data?.email,
    });
  });

  test("Register: invalid email throws 422 error", async () => {
    const data = {
      fullname: "John Doe",
      email: "johndoeexample.com",
      password: "password",
    };
    const response = await request(app).post("/api/register").send(data);

    expect(response.statusCode).toEqual(SC.UNPROCESSABLE_CONTENT);
    expect(response.body._errors.email._errors.length).toBeGreaterThan(0);
  });

  test("Register: using same email twice throws 409 error", async () => {
    const data1 = {
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    await request(app).post("/api/register").send(data1);

    const data2 = {
      fullname: "John Doe 2",
      email: "johndoe@example.com",
      password: "password",
    };
    const response = await request(app).post("/api/register").send(data2);
    expect(response.statusCode).toBe(SC.CONFLICT);
    expect(response.body.errorCode).toBe(appErrorCode.EmailInUse);
  });

  test("Register: passwords are saved as hashed string", async () => {
    const data = {
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const response = await request(app).post("/api/register").send(data);

    const id = response.body.createdUserId;
    const dbUser = await User.findById({ _id: id }).exec();
    expect(dbUser?.password).not.toBe(data.password);
    expect(typeof dbUser?.password).toBe("string");
    expect(await bcrypt.compare(data.password, dbUser?.password as string)).toBeTruthy();
  });

  // ------------------------------------------------------
  // Login tests
  // ------------------------------------------------------
  test("Login: User can login after registration", async () => {
    const registerData = {
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const registerResponse = await request(app).post("/api/register").send(registerData);

    const userId = registerResponse.body.createdUserId;

    const loginData = {
      email: "johndoe@example.com",
      password: "password",
    };
    const loginResponse = await request(app).post("/api/login").send(loginData);
    expect(loginResponse.statusCode).toBe(SC.OK);
    expect(loginResponse.body.success).toBe(true);
    const accessToken = loginResponse.body.accessToken;
    expect(typeof accessToken).toBe("string");
    const decodedData = <{ _id: string } & object>jwt.verify(accessToken, configKeys.accessTokenSecret);
    const decodedId = decodedData?._id ?? undefined;
    expect(decodedId).toBe(userId);
  });

  test("Login: valid input works returns 200", async () => {
    const user = await User.create({
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
    });
    const userId = user?._id.toString();

    const loginData = {
      email: "johndoe@example.com",
      password: "password",
    };
    const loginResponse = await request(app).post("/api/login").send(loginData);
    expect(loginResponse.statusCode).toBe(SC.OK);
    expect(loginResponse.body.success).toBe(true);
    const accessToken = loginResponse.body.accessToken;
    expect(typeof accessToken).toBe("string");
    const decodedData = <{ _id: string } & object>jwt.verify(accessToken, configKeys.accessTokenSecret);
    const decodedId = decodedData?._id ?? undefined;
    expect(decodedId).toBe(userId);
  });

  test("Login: wrong credentials doesn't work, returns 401 error", async () => {
    await User.create({
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
    });

    const wrongLoginData = [
      {
        email: "johndoe_wrong@example.com",
        password: "password",
      },
      {
        email: "johndoe@example.com",
        password: "wrong_password",
      },
    ];
    for (const loginData of wrongLoginData) {
      const loginResponse = await request(app).post("/api/login").send(loginData);
      expect(loginResponse.statusCode).toBe(SC.UNAUTHORIZED);
    }
  });

  test("Login: invalid email doesn't work, returns 422 error", async () => {
    const loginData = {
      email: "johndoeexample.com",
      password: "password",
    };
    const loginResponse = await request(app).post("/api/login").send(loginData);
    expect(loginResponse.statusCode).toBe(SC.UNPROCESSABLE_CONTENT);
  });

  test("Login: accessToken, expiresAt & refreshToken is returned after login", async () => {
    await User.create({
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
    });

    const loginData = {
      email: "johndoe@example.com",
      password: "password",
    };
    const loginResponse = await request(app).post("/api/login").send(loginData);
    expect(loginResponse.body.accessToken).toBeDefined();
    const accessToken = loginResponse.body.accessToken;
    expect(typeof accessToken).toBe("string");

    expect(loginResponse.body.expiresAt).toBeDefined();
    const expiresAt = loginResponse.body.expiresAt;
    expect(typeof expiresAt).toBe("number");
    expect(new Date(expiresAt)).toBeInstanceOf(Date);

    const cookies = loginResponse.headers["set-cookie"];
    expect(Array.isArray(cookies)).toBe(true);
    const refreshToken = getRefreshTokenFromSuperTestResponse(loginResponse);
    expect(refreshToken).toBeDefined();
    expect(typeof refreshToken).toBe("string");
  });

  // ------------------------------------------------------
  // Logout tests
  // ------------------------------------------------------
  test("Logout: reponse returns 204 code", async () => {
    await User.create({
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: await bcrypt.hash("password", 10),
      createdAt: new Date(),
    });

    const loginData = {
      email: "johndoe@example.com",
      password: "password",
    };
    const loginResponse = await request(app).post("/api/login").send(loginData);
    const accessToken = loginResponse.body.accessToken;
    const refreshToken = getRefreshTokenFromSuperTestResponse(loginResponse);
    const logoutResponse = await request(app)
      .post("/api/logout")
      .set("Authorization", "Bearer " + accessToken)
      .set("Cookie", "refreshToken=" + refreshToken);
    expect(logoutResponse.statusCode).toBe(SC.NO_CONTENT);
  });

  // ------------------------------------------------------
  // Authorization tests
  // ------------------------------------------------------
  describe("Authorization tests", () => {
    let accessToken: string = "";
    // let expiresAt: number = 0;
    let refreshToken: string = "";
    let defaultCreatedUser: IUser | undefined;

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
      // expiresAt = loginResponse.body.expiresAt;
      refreshToken = getRefreshTokenFromSuperTestResponse(loginResponse);
    });

    test("Authorization: user can fetch own's profile data with the accesstoken", async () => {
      const response = await request(app)
        .get("/api/users/me")
        .set("Authorization", "Bearer " + accessToken);
      expect(response?.body?.data?._id).toBe(defaultCreatedUser?._id?.toString());
    });

    test("Authorization: user can refresh his accesstoken", async () => {
      const response = await request(app)
        .post("/api/auth/getNewAccessToken")
        .set("Cookie", "refreshToken=" + refreshToken);
      expect(response?.body?.accessToken).toBeDefined();
    });

    test("Authorization: new accessToken works perfectly", async () => {
      const response = await request(app)
        .post("/api/auth/getNewAccessToken")
        .set("Cookie", "refreshToken=" + refreshToken);
      expect(response?.body?.accessToken).toBeDefined();
      const newAccessToken = response?.body?.accessToken;
      const response2 = await request(app)
        .get("/api/users/me")
        .set("Authorization", "Bearer " + newAccessToken);
      expect(response2?.body?.data?._id).toBe(defaultCreatedUser?._id?.toString());
    });

    test("After logout old accessToken & refreshToken doesn't work", async () => {
      const logoutResponse = await request(app)
        .post("/api/logout")
        .set("Authorization", "Bearer " + accessToken)
        .set("Cookie", "refreshToken=" + refreshToken);
      expect(logoutResponse.statusCode).toBe(SC.NO_CONTENT);

      const res1 = await request(app)
        .get("/api/users/me")
        .set("Authorization", "Bearer " + accessToken);
      expect(res1?.statusCode).toBe(SC.UNAUTHORIZED);

      const res2 = await request(app)
        .post("/api/auth/getNewAccessToken")
        .set("Cookie", "refreshToken=" + refreshToken);
      expect(res2?.statusCode).toBe(SC.UNAUTHORIZED);
    });
  });
});
