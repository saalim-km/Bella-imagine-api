import { createClient } from "redis";

export const redisClient = createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
  // password: "your-password", // only if you set one explicitly
});

redisClient.on("error", (err) => console.error("Redis error:", err));
redisClient.on("connect", () => console.log("Redis connected"));

(async () => {
  await redisClient.connect();
  await redisClient.set("test", "123");
  const val = await redisClient.get("test");
  console.log("GET test =", val);
  await redisClient.disconnect();
})();
