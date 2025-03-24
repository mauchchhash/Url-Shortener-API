import mongoose from "mongoose";
import dotEnv from "dotenv";
import { isTestEnv } from "./helpers";

dotEnv.config();
const HOST = process?.env?.MONGODB_HOST || "localhost";
const PORT = process?.env?.MONGODB_PORT || "27017";
const DBNAME = process?.env?.MONGODB_DBNAME || "url_shortener";

const uri = `mongodb://${HOST}:${PORT}/${DBNAME}`;
const options = {};

export const connectWithDb = async () => {
  return mongoose
    .connect(uri, options)
    .then(() => {
      if (isTestEnv()) return;

      //console.log("-------------------------------------------------------------------------------------------------");
      console.log("✅Connected to Database Successfully");
      //console.log("-------------------------------------------------------------------------------------------------");
    })
    .catch((err) => {
      console.log("-------------------------------------------------------------------------------------------------");
      console.log("❌DB connection failed");
      console.log("-------------------------------------------------------------------------------------------------");
      console.log(err);
    });
};
