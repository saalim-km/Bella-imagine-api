import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config()
import { config } from "./shared/config/config";
import { MongoConnect } from "./interfaceAdapters/database/mongodb/connect-mongo";
import { connectRedis } from "./interfaceAdapters/redis/connect-redis.client";
import logger from "./shared/logger/logger";
import { Server } from "./presentation/http/server";

async function bootstrap() {
  try {
    const connectMongo = new MongoConnect();
    await connectMongo.connect();

    await connectRedis();

    const server = new Server();
    server.getServer().listen(Number(config.server.PORT), "0.0.0.0", () => {
      logger.info(`Server started running on port: ${config.server.PORT} ✅`);
    });
  } catch (error) {
    logger.error("Startup error:", error);
    process.exit(1);
  }
}


bootstrap();