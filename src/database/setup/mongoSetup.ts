import mongoose from "mongoose";
import { isTestEnv } from "../../helpers";
import configKeys from "../../config/keys";

const HOST = configKeys.mongoHost;
const PORT = configKeys.mongoPort;
const DBNAME = configKeys.mongoDbName;

const uri = `mongodb://${HOST}:${PORT}/${DBNAME}`;
const options = {};

export const connectToMongoDB = async () => {
  return mongoose
    .connect(uri, options)
    .then(() => {
      if (isTestEnv()) return;

      console.log("✅Connected to Database Successfully");
    })
    .catch((err) => {
      console.log("-------------------------------------------------------------------------------------------------");
      console.log("❌DB connection failed");
      console.log("-------------------------------------------------------------------------------------------------");
      console.log(err);
    });
};
