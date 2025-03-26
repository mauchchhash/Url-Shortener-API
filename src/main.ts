import dotEnv from "dotenv";
import app from "./createApp";
import configKeys from "./config/keys";

dotEnv.config();

const PORT = configKeys.serverPort;

app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});
