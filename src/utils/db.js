const config = require('./config');
const mongoose = require('mongoose');
const { logger } = require('./logger');
const { error } = require('winston');

const connectToDb = async () => {
    // Use Logger to log the connection status for information
    const db = mongoose.connection;

    db.on("connecting", () => {
        logger.info("Attempting to connect to DB");
    })

    db.on("connected", () => {
        logger.info("Connected to DB successfully");
    })

    db.on("error", (error) => {
        logger.error("DB connection error", {payload: error});
        // if error occurs, exit the process; normal exit code is process.exit(0);
        // above 0 is error code for exit
        process.exit(1);
    })
    
    db.on("disconnected", () => {
        logger.warn("DB Connection disconnected");
    })

    db.on("reconnected", () => {
        logger.info("DB Connection reconnected");
    })

    mongoose.connect(config.DB_CONNECTION_STRING);
}

module.exports = connectToDb;