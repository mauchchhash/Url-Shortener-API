import request from "supertest";
import app from "../src/createApp";
import User from "../src/database/models/UserModel";

describe("Authentication suite", () => {
  // register: email, password, fullname
  //    - valid input works - return 200
  //    - invalid input doesn't work, returns 422 error
  //    - same email cannot be used twice, returns 422 error
  // login: email, password
  //    - valid input works - return 200
  //    - invalid input doesn't work, returns 422 error

  test("register: valid input registers a user", async () => {
    const data = {
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    const response = await request(app).post("/register").send(data);

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

  test("register: invalid email throws 422 error", async () => {
    const data = {
      fullname: "John Doe",
      email: "johndoeexample.com",
      password: "password",
    };
    const response = await request(app).post("/register").send(data);

    expect(response.statusCode).toEqual(422);
    expect(response.body._errors.email._errors.length).toBeGreaterThan(0);
  });

  test("register: invalid email throws 422 error", async () => {
    const data1 = {
      fullname: "John Doe",
      email: "johndoe@example.com",
      password: "password",
    };
    await request(app).post("/register").send(data1);

    const data2 = {
      fullname: "John Doe 2",
      email: "johndoe@example.com",
      password: "password",
    };
    const response = await request(app).post("/register").send(data2);
    expect(response.statusCode).toBe(422);
    expect(response.body._errors.email._errors.length).toBeGreaterThan(0);
  });
});
