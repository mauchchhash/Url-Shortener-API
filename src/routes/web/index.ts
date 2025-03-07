import { Response, Router } from "express";

const webRouter = Router();
webRouter.get("/", (_, response: Response) => {
  response.send("Api");
});

export default webRouter;
