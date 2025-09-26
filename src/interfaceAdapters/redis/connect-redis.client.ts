import { createClient } from "redis";
import { config } from "../../shared/config/config";
import logger from "../../shared/logger/logger";

export const redisClient = createClient({
  password: config.redis.REDIS_PASS,
  socket: {
    host: config.redis.REDIS_HOST || 'redis', // 👈 Container name
    port: Number(config.redis.REDIS_PORT) || 6379,
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