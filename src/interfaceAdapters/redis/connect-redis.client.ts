import { createClient } from "redis";
import { config } from "../../shared/config/config";
import logger from "../../shared/logger/logger";

export const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

redisClient.on("error", (error) => {
  logger.error("Redis Client Error: ", error);
});

export async function connectRedis() {
  try {
    await redisClient.connect();
    logger.info("Redis connected successfully");
  } catch (error: any) {
    logger.error("Redis connection failed: ", error);
    throw error;
  }
}
