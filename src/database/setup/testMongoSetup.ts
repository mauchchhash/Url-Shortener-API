import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer: MongoMemoryServer;

export const connectToTestMongoDB = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  return mongoose
    .connect(uri)
    .then(() => {
      // if (isTestEnv()) return;
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
  await mongoServer.stop();
};

export const clearTestMongoDBCollections = async () => {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((cl) => cl.deleteMany({})));
};
