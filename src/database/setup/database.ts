import { isTestEnv } from "../../helpers";
import { connectToMongoDB } from "./mongoSetup";

export const connectToDB = () => {
  if (isTestEnv()) {
    // connectToTestMongoDB();
  } else {
    connectToMongoDB();
  }
};
