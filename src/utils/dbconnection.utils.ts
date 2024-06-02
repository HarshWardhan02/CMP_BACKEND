
import mongoose from 'mongoose';
import config from 'config';
import { logger } from './log.utils';
export const connectDatabase= () => {
   logger.info("Trying to connect to localdb");
    const databaseUrl = config.get("db") + '/' + config.get("databaseName");
    console.log(databaseUrl,"auro singh pagalllllll");
    logger.info("Database:", databaseUrl);
    mongoose.connect(databaseUrl)
    .then(() => console.log('Connection to DB successful!'))
    .catch((err:any)=>logger.error(err));

    /*
    try{
        await mongoose.connect(databaseUrl);
        logger.info("Connection to DB successful");
    } catch (exception) {
        logger.err(exception);
    }*/
};