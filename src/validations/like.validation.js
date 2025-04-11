const Joi = require('joi');
const { objectIdValidationSchema } = require('./common.validation');

const likeValidationSchema = {
    create: Joi.object({
        targetId: objectIdValidationSchema.required(),
        targetType: Joi.string().valid('Post', 'Comment').required(),
    })
}

module.exports = likeValidationSchema;