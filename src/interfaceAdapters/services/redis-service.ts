import { injectable } from "tsyringe";
import { IRedisService } from "../../domain/interfaces/service/redis-service.interface";
import { redisClient } from "../redis/connect-redis.client";

@injectable()
export class RedisService implements IRedisService {
    async get(key: string): Promise<string | null> {
        return await redisClient.get(key)
    }

    async set(key: string, value: string , expiry : number = 3600): Promise<void> {
        await redisClient.set(key, value, { EX: expiry })
    }

    async delete(key: string): Promise<void> {
        await redisClient.del(key)
    }
}