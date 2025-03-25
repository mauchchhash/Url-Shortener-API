import { Router } from "express";

const authRouter = Router();
authRouter.post("/register", (req, res) => {
  res.send("register");
});

export default authRouter;
