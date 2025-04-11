const winston = require('winston');
const path = require('path');
const config = require('./config');

// createLogger(__filename) - to get the filename
const createLogger = (filename) => {
    const logger = winston.createLogger(
        {
            level: config.LOG_LEVEL,
            defaultMeta: {
                filename: filename ? path.basename(filename) : undefined,
            },
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.printf(({ timestamp, filename, level, message, payload }) => {
                    const fileInfo = filename ? `[${filename}]` : '';
                    const payloadInfo = payload ? `\n${JSON.stringify(payload)}` : '';
                    return `[${timestamp}] [${level}] ${fileInfo}: ${message}${payloadInfo}`;
                })),
            // Where do you want to show logs
            transports: [
                //Info will be console log
                new winston.transports.Console(),
                // // Logs will be saved in the combined file
                // new winston.transports.File({filename: 'logs/combined.log'}),
                // // Error will be saved in the separate error file
                // new winston.transports.File({filename: 'logs/error.log', level: 'error'})
            ]
        }
    );
    return logger;
};

module.exports = {
    // Method 1: directly export createLogger function - if u want to manually create logger
    createLogger,
    // Method 2: Destructing the object by using () and return object - if u want to use logger directly
    logger: createLogger(),
};