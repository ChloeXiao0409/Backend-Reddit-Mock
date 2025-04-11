const Joi = require("joi");
const mongoose = require("mongoose");

// Both page and comment need to set up pagination validation
const paginationValidationSchema = {
    limit: Joi.number().integer().min(1).max(100).default(10),
    // if page is not provided, default to 1
    page: Joi.number().integer().min(1).default(1),
}

// Customized Validation of post for both post and comment -> define what error
const objectIdValidator = (value, helpers) => {
    if(!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error('any.invalid');
    }
    return value;
}
// Customized error message for objectId validation -> define what error message to show
const objectIdValidationSchema = Joi.string().custom(objectIdValidator, "objectId validation").message({
    'any.invalid': '{{#label}} must be a valid ObjectId',
});

module.exports = {
    paginationValidationSchema,
    objectIdValidationSchema,
};