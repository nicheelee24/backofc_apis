import { logger } from "./logger";
import mongoose from 'mongoose'
export const connectToMongoDb = (MONGODB_URL:string) => {
  let retryCount = 0
  const retryLimit = 5
  const retryInterval = 5000

  mongoose.connection.on('error', (err) => {
    console.error(err);
    logger.info(
      '%s MongoDB connection error. Please make sure MongoDB is running.',
      '✗'
    );
    logger.error(`Failed to connect to mongo on startup - retrying in 5 sec, Current Retry Count: ${retryCount}`);
    if (retryCount < retryLimit) {
      setTimeout(connectToDatabaseWithRetry, retryInterval, mongoose, MONGODB_URL, logger);
      retryCount++;
    } else {
      process.exit(1);
    }
  });
  mongoose.connection.once('open', () => {
    logger.info('Connection to db established');
  });
  mongoose.connection.on('reconnected', function () {
    logger.info('Database reconnected!');
  });
  mongoose.connection.on('disconnected', function() {
    logger.error('Database disconnected!');
  });
  connectToDatabaseWithRetry(MONGODB_URL);
}

const connectToDatabaseWithRetry = function(MONGODB_URL: string) {
  if(mongoose) mongoose.connect(MONGODB_URL);
  else logger.error(`Mongoose Object Null!!`)
};
