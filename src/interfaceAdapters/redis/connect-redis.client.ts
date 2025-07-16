import { createClient } from "redis";
import { config } from "../../shared/config/config";
import logger from "../../shared/logger/logger";

// Enhanced configuration logging
logger.debug("Redis Connection Details:", {
  host: config.redis.REDIS_HOST,
  port: config.redis.REDIS_PORT,
  usingTLS: true,
  redisVersion: "7.4", // From your AWS console
  region: "ap-south-1" // Mumbai region
});

export const redisClient = createClient({
  username: config.redis.REDIS_USERNAME,
  password: config.redis.REDIS_PASS,
  socket: {
    host: config.redis.REDIS_HOST,
    port: parseInt(config.redis.REDIS_PORT, 10),
    tls: true,
    rejectUnauthorized: false, // Critical for AWS ElastiCache
    secureProtocol: 'TLSv1_2_method', // Force TLS 1.2
    servername: config.redis.REDIS_HOST // SNI support
  },
});

// Enhanced error handling
redisClient.on('error', (err) => {
  logger.error('Redis connection error:', {
    message: err.message,
    code: (err as any).code,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
  
  if (err.message.includes('WRONGPASS')) {
    logger.error('Authentication failed - please verify Redis credentials');
  }
});

export async function connectRedis() {
  try {
    logger.info(`Connecting to Redis at ${config.redis.REDIS_HOST}:${config.redis.REDIS_PORT}`);
    await redisClient.connect();
    
    // Verify connection
    await redisClient.ping();
    logger.info('Redis connection verified with PING command');
    
  } catch (error: any) {
    logger.error('Redis connection failed:', {
      error: error.message,
      config: {
        host: config.redis.REDIS_HOST,
        port: config.redis.REDIS_PORT,
        usingTLS: true
      },
      suggestion: error.message.includes('ssl3_get_record') ? 
        'Try connecting without TLS or verify TLS configuration on server' :
        'Check network connectivity and credentials'
    });
    
    // Close client to prevent resource leaks
    await redisClient.quit().catch(() => {});
    throw error;
  }
}