import request from "supertest";
import app from "../src/createApp";

describe("Authentication suite", () => {
  // register: username, email, password, fullname
  //    - valid input works - return 200
  //    - invalid input doesn't work, returns 422 error
  // login: username or email, password
  //    - valid input works - return 200
  //    - invalid input doesn't work, returns 422 error
  test("register: username, email, password, fullname", async () => {
    const data = {
      fullname: "John Doe",
      username: "johndoe",
      email: "johndoe@example.com",
      password: "password",
    };
    const rs = await request(app).post("/register").send(data);
  });
});
