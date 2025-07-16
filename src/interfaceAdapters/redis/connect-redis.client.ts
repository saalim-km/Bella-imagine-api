import { createClient } from "redis";
import { config } from "../../shared/config/config";
import logger from "../../shared/logger/logger";

logger.debug("Redis Connection Configuration:", {
  host: config.redis.REDIS_HOST,
  port: config.redis.REDIS_PORT,
  username: config.redis.REDIS_USERNAME ? "*****" : "undefined",
  password: config.redis.REDIS_PASS ? "*****" : "undefined",
  tlsEnabled: true
});

export const redisClient = createClient({
  username: config.redis.REDIS_USERNAME,
  password: config.redis.REDIS_PASS,
  socket: {
    host: config.redis.REDIS_HOST,
    port: parseInt(config.redis.REDIS_PORT, 10),
    tls: true,
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
