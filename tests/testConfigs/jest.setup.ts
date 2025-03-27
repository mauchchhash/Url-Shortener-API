import {
  clearTestMongoDBCollections,
  connectToTestMongoDB,
  disconnectFromTestMongoDB,
} from "../../src/database/setup/testMongoSetup";

beforeAll(async () => {
  await connectToTestMongoDB();
});

afterAll(async () => {
  await disconnectFromTestMongoDB();
});

beforeEach(async () => {
  await clearTestMongoDBCollections();
});
