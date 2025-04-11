// This is a final error handler so it wont address the specific error message
// It just a error log record

const { logger } = require("../../utils/logger");

module.exports = (error, req, res, next) => {
    logger.error("Unexpected error occurred", {
        payload: {
            error: error.message,
            stack: error.stack,
            path: req.path,
            method: req.method,
        }
    })

    res.status(500).json({
        success: false,
        error: "Something went wrong!",
    })
    // Stop here cus no call for the next()
}