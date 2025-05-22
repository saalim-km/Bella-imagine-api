import "reflect-metadata";
import { MongoConnect } from "./interfaceAdapters/database/mongodb/connect-mongo";
import { connectRedis } from "./interfaceAdapters/redis/connect-redis-client";
import logger from "./domain/shared/logger/logger";
import { Server } from "./presentation/http/server";
import { config } from "./interfaceAdapters/config/config";

async function bootstrap() {
    try {
        // Connect MongoDB
        const connectMongo = new MongoConnect();
        await connectMongo.connect();

        // Connect Redis
        await connectRedis();

        // Start Server
        const server = new Server();
        server.getServer().listen(config.server.PORT, () => {
            logger.info(`Server started running on port: ${config.server.PORT} ✅`);
        });

    } catch (error) {
        logger.error("Startup error:", error);
        process.exit(1); // exit process if startup fails
    }
}

bootstrap();