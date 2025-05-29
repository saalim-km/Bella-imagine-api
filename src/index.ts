import "reflect-metadata";
import { MongoConnect } from "./interfaceAdapters/database/mongodb/connect-mongo";
import { connectRedis } from "./interfaceAdapters/redis/connect-redis.client";
import logger from "./shared/logger/logger";
import { Server } from "./presentation/http/server";
import { config } from "./shared/config/config";

async function bootstrap() {
    try {
        const connectMongo = new MongoConnect();
        await connectMongo.connect();

        await connectRedis();

        const server = new Server();
        server.getServer().listen(config.server.PORT, () => {
            logger.info(`Server started running on port: ${config.server.PORT} ✅`);
        });

    } catch (error) {
        logger.error("Startup error:", error);
        process.exit(1);
    }
}

bootstrap();