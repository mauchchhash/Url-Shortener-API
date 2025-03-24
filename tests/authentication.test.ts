import app from "../src/createApp";

describe("Authentication suite", () => {
  // register: username, email, password, fullname
  //    - valid input works - return 200
  //    - invalid input doesn't work, returns 422 error
  // login: username or email, password
  //    - valid input works - return 200
  //    - invalid input doesn't work, returns 422 error
  test("register: username, email, password, fullname", () => {
    console.log({ appLocals: app.locals });
  });
});
