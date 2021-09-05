import "dotenv/config";

const Config = {
  apiPrefix: process.env.API_PREFIX || "api",
  apiVersion: process.env.API_VERSION || "v1",
  hashRound: process.env.HASH_ROUND || 10,
  jwtKey: process.env.JWT_KEY,
  DB: {
    dbUrl: process.env.DB_SERVER_URL || null,
    dbName: process.env.DB_SERVER_NAME || "MongoDB",
  },
};

export default Config;
