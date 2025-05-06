import { createClient } from 'redis';
import logger from '../../shared/utils/logger.utils';
import { config } from '../../shared/config';

export const redisClient = createClient({
    username: config.redis.REDIS_USERNAME,
    password: config.redis.REDIS_PASS,
    socket: {
        host: config.redis.REDIS_HOST,
        port: parseInt(config.redis.REDIS_PORT, 10),
        tls: process.env.NODE_ENV === 'production'
    }
});

redisClient.on('error', (error) => {
    logger.error('Redis Client Error: ', error)
})

export async function connectRedis() {
    try {
        await redisClient.connect();
        logger.info('Redis connected successfully')
    } catch (error: any) {
        logger.error('Redis connection failed: ', error)
        throw error;
    }
}