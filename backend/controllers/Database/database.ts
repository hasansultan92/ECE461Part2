const mongoose = require('mongoose');
import {log} from '../utils/misc';

export const connect = (logLevel: number, MongoUrl: string): number => {
  // Connecting to the database
  let returnVal = 0; // Default value needs to be zero
  try {
    mongoose.connect(MongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    returnVal = 1;
  } catch (error: any) {
    log('Failure to connect with Database', error.stack, logLevel);
    returnVal = 0;
  } finally {
    return returnVal;
  }
};
