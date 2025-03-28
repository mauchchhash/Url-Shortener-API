import Redis from "ioredis";
import configKeys from "./config/keys";

// export const redis = new Redis(configKeys.redisPort, configKeys.redisHost);
const redisClient = new Redis(configKeys.redisPort, configKeys.redisHost);
export default redisClient;
