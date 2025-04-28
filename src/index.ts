import "reflect-metadata"
import { MongoConnect } from "./frameworks/database/mongodb/mongoConnect";
import { Server } from "./frameworks/http/server";
import { config } from "./shared/config";

const server = new Server()
const connectMongo = new MongoConnect();
connectMongo.connect();

server.
getServer()
.listen(config.server.PORT, ()=> {
    console.log(`Server started running on port : ${config.server.PORT} ✅`);
})