const UnauthorizedException = require("../../exceptions/unauthorized.exception");
const {logger} = require("../../utils/logger");

module.exports = (error, req, res, next) => {
    // 1. Check if this error is an instance of UnauthorizedException
    if(error instanceof UnauthorizedException) {
        // 2. Record the error using logger
        logger.info("Unauthorized access", {
            payload: {
                method: req. method,
                path: req.path,
                message: error.message,
                ...error.payload,
            }
        }) 
        // 3. Send response with status code and message
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
        })
    }
    // 4. MUST call next() to pass the error to the next middleware
    next(error); // pass the error to the next middleware
}