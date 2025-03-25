import mongoose from "mongoose";
import dotEnv from "dotenv";
import { isTestEnv } from "../helpers";

dotEnv.config();
const HOST = process?.env?.TEST_MONGODB_HOST || "localhost";
const PORT = process?.env?.TEST_MONGODB_PORT || "27017";
const DBNAME = process?.env?.TEST_MONGODB_DBNAME || "url_shortener";

const uri = `mongodb://${HOST}:${PORT}/${DBNAME}`;
const options = {};

export const connectToTestMongoDB = async () => {
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

export const disconnectFromTestMongoDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};
