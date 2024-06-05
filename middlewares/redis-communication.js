// const redisClient = require("../configs/redis.js");

export const getRedisValue = async (key) => {
    const value = await global.redisClient.get(key);
    try {
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (error) {
      return value;
    }
}

export const setRedisValue = async (key, time, result) => {
    const value = await global.redisClient.setEx(key, time, JSON.stringify(result));
    return value
}

export const removeRedisValue = async (key) => {
  await redisClient.del(key);
};
