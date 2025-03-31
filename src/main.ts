import dotEnv from "dotenv";
dotEnv.config();
import app from "./createApp";
import configKeys from "./config/keys";

const PORT = configKeys.serverPort;

app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});
