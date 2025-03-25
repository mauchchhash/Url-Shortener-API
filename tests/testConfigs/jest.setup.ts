import { connectToTestMongoDB, disconnectFromTestMongoDB } from "../../src/dbSetup/testMongoSetup";

beforeEach(async () => {
  await connectToTestMongoDB();
});

afterEach(async () => {
  await disconnectFromTestMongoDB();
});
