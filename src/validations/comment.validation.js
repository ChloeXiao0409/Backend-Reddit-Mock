const Joi = require('joi');
const {paginationValidationSchema, objectIdValidationSchema} = require('./common.validation');

const baseValidationSchema = {
    content: Joi.string().max(1000),
    post: objectIdValidationSchema,
}

const commentValidationSchema = {
    create: Joi.object({
        content: baseValidationSchema.content.required(),
        post: baseValidationSchema.post.required(),
    }),
    update: Joi.object({
        content: baseValidationSchema.content.required(),
    }),
    getCommentsById: Joi.object({
        post: baseValidationSchema.post.required(),
        ...paginationValidationSchema,
    }),
}

module.exports = commentValidationSchema;