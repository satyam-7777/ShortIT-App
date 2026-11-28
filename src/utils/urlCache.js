const { redisClient } = require("../connections/redis");

const CACHE_TTL_SECONDS = 60 * 60;

const getCachedOriginalUrl = async (shortCode) => {
  try {
    if (!redisClient.isReady) {
      return null;
    }

    const key = `shorturl:${shortCode}`;

    return await redisClient.get(key);
  } catch (error) {
    console.error("Redis cache read error:", error.message);
    return null;
  }
};

const cacheOriginalUrl = async (shortCode, originalUrl) => {
  try {
    if (!redisClient.isReady) {
      return;
    }

    const key = `shorturl:${shortCode}`;

    await redisClient.set(key, originalUrl, {
      EX: CACHE_TTL_SECONDS,
    });
  } catch (error) {
    console.error("Redis cache write error:", error.message);
  }
};

const invalidateOriginalUrl = async (shortCode) => {
  try {
    if (!redisClient.isReady) {
      return;
    }

    const key = `shorturl:${shortCode}`;

    await redisClient.del(key);
  } catch (error) {
    console.error("Redis cache delete error:", error.message);
  }
};

module.exports = {
  getCachedOriginalUrl,
  cacheOriginalUrl,
  invalidateOriginalUrl,
};
