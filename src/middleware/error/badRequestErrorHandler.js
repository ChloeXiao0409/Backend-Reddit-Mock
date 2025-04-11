const {logger} = require("../../utils/logger");
const ValidationException = require("../../exceptions/validation.exception");

module.exports = (error, req, res, next) => {

    // Joi need to be triggered first
    if (error instanceof ValidationException) {
        logger.info("Joi Validation error", {
            payload: {
                type: "Joi validation",
                path: req.path,
                method: req.method,
                error,
            },
        })
        // 3. return the error to the client
        return res.status(error.statusCode).json({
            success: false,
            error: error.message,
        });
    }

    // 1. Check if this error is the corresponding error need to be handled
    if (error.name === "ValidationError") {
        // 2. Record the error
        // Cus the database will be the last to do the validation, set it as Warning level
        logger.warn("Mongoose Validation error", {
            payload: {
                path: req.path,
                method: req.method,
                error,
            },
        })
        // 3. return the error to the client
        return res.status(400).json({
            success: false,
            error: error.message,
        });
    }
    // 4. MUST call next() and pass the error to the next middleware
    next(error);
}