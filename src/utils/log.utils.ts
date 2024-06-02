import * as Logger from 'bunyan';
import config from 'config';


export const logger = Logger.createLogger({
    name: "cmp_backend",
    streams: [
      {
        type: config.get("logType"),
        level: config.get("logLevel"),
        path: config.get("logFile"),
        period: config.get("logRotation"),
        count: config.get("logCopies")
      }
    ]
});