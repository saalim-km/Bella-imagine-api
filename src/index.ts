import "reflect-metadata";
import { MongoConnect } from "./frameworks/database/mongodb/mongoConnect";
import { Server } from "./frameworks/http/server";
import { config } from "./shared/config";
import logger from "./shared/logger/logger.utils";
import { connectRedis } from "./frameworks/redis/redis.client";

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