// const redisClient = require("../configs/redis.js");

export const getRedisValue = async (key: string) => {
    const value = await globalThis.redisClient.get(key);
    try {
      const parsedValue = JSON.parse(value);
      return parsedValue;
    } catch (error) {
      return value;
    }
}

export const setRedisValue = async (key: string, time: number, result: any) => {
    const value = await globalThis.redisClient.setEx(key, time, JSON.stringify(result));
    return value
}

export const removeRedisValue = async (key: string) => {
  await redisClient.del(key);
};
