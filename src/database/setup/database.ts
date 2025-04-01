import { isTestEnv } from "../../utils/helpers";
import { connectToMongoDB } from "./mongoSetup";

export const connectToDB = () => {
  if (isTestEnv()) {
    // connectToTestMongoDB();
  } else {
    connectToMongoDB();
  }
};
