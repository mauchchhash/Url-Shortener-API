const configKeys = {
  appEnv: process?.env?.NODE_ENV ?? "production",
  serverPort: process?.env?.SERVER_PORT ?? 3000,

  mongoHost: process?.env?.MONGODB_HOST ?? "db",
  mongoPort: process?.env?.MONGODB_PORT ?? "27017",
  mongoDbName: process?.env?.MONGODB_DBNAME ?? "url_shortener",

  testMongoHost: process?.env?.TEST_MONGODB_HOST ?? "test-db",
  testMongoPort: process?.env?.TEST_MONGODB_PORT ?? "27017",
  testMongoDbName: process?.env?.TEST_MONGODB_DBNAME ?? "test",
};
export default configKeys;
