import { connectToTestMongoDB, disconnectFromTestMongoDB } from "../../src/database/setup/testMongoSetup";

beforeEach(async () => {
  await connectToTestMongoDB();
});

afterEach(async () => {
  await disconnectFromTestMongoDB();
});
