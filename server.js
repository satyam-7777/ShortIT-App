const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectMongoDB = require("./src/connections/db.js");
const connectRedis = require("./src/connections/redis.js");

const SERVER_PORT = Number(process.env.SERVER_PORT) || 8000;

async function startServer() {
  try {
    await connectMongoDB();
    await connectRedis();

    app.listen(SERVER_PORT, () => {
      console.log(`Server started at port ${SERVER_PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err.message);
    process.exitCode = 1;
  }
}

startServer();
