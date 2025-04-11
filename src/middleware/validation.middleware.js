// This validation middleware parse a schema
const ValidationException = require("../exceptions/validation.exception");
const mongoose = require("mongoose");
 
const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            const value = await schema.validateAsync(req.body, {
                stripUnknown: true,
                allowUnknown: true,
            })
            req.body = value; // Assign the very most validated value back to req.body
            next();
        } catch(error) {
            // Meet one error need to be addressd, create a new exception!
            // 1. Create a new exception
            next(new ValidationException(error.details[0].message), error)
        }
    }
}

const validateQuery = (schema) => {
    return async (req, res, next) => {
        try {
            const value = await schema.validateAsync(req.query, {
                stripUnknown: true,
                allowUnknown: true,
            })
            req.query = value; // Assign the very most validated value back to req.query
            next();
        } catch(error) {
            // Meet one error need to be addressd, create a new exception!
            // 1. Create a new exception
            next(new ValidationException(error.details[0].message), error)
        }
    }
}

// This is aim to report if objectId is valid
// /posts/:id => id is the key
// /posts/:postId => postId is the key
// so key is dynamic
const validateObjectId = (key) => {
    return (req, res, next) => {
        if(!mongoose.Types.ObjectId.isValid(req.params[key])) {
            throw new ValidationException(`${key} is not valid ObjectId.`);
        }
        next();
    }
}

module.exports = {
    validateBody,
    validateQuery,
    validateObjectId,
};