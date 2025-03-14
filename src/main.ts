import dotEnv from "dotenv";
import app from "./createApp";

dotEnv.config();

const PORT = process?.env?.SERVER_PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server listening to port: ${PORT}`);
});
