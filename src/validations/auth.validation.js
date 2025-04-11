const Joi = require("joi");

const baseAuthSchema = {
    username: Joi.string().alphanum().min(2).max(20).required().messages({
        "string.min": "Username must be at least 2 characters",
        "string.max": "Username must be at most 20 characters",
        "string.alphanum": "Username can only contain alpanumeric characters",
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
    })
}

const authValidationSchema = {
    register: Joi.object ({
        //Can be easily modify any params if using constructor
        ...baseAuthSchema,
    }),
    login: Joi.object ({
        //Can be easily modify any params if using constructor
        ...baseAuthSchema,
    }),
}

module.exports = authValidationSchema;