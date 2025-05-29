import mongoose from "mongoose";
import { config } from "../../../shared/config/config";

export class MongoConnect {
    private MongoUrl : string;

    constructor() {
        this.MongoUrl = config.database.URI;
    }

    async connect() {
        try {
            await mongoose.connect(this.MongoUrl);
            console.log('Database connect aayi 🕺');

            mongoose.connection.on("error", (error) => {
                console.error("MongoDB connection error:", error);
              });
        
            mongoose.connection.on("disconnected", () => {
                console.log("MongoDB disconnected 😢");
            });
        } catch (error) {
            console.error("Failed to connect to MongoDB:", error);
            throw new Error("Database connection failed");
        }
    }
}