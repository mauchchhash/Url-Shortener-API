import request from "supertest";
import app from "../src/createApp";
import User from "../src/database/models/UserModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import configKeys from "../src/config/keys";

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

    expect(response.statusCode).toEqual(201);
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

    expect(response.statusCode).toEqual(422);
    expect(response.body._errors.email._errors.length).toBeGreaterThan(0);
  });

  test("Register: using same email twice throws 422 error", async () => {
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
    expect(response.statusCode).toBe(422);
    expect(response.body._errors.email._errors.length).toBeGreaterThan(0);
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
    expect(loginResponse.statusCode).toBe(200);
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
    expect(loginResponse.statusCode).toBe(200);
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
      expect(loginResponse.statusCode).toBe(401);
    }
  });

  test("Login: invalid email doesn't work, returns 422 error", async () => {
    const loginData = {
      email: "johndoeexample.com",
      password: "password",
    };
    const loginResponse = await request(app).post("/api/login").send(loginData);
    expect(loginResponse.statusCode).toBe(422);
  });
});
