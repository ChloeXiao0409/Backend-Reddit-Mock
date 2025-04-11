const Joi = require('joi');
const paginationValidationSchema = require('./common.validation');

const baseValidationSchema = {
    title: Joi.string().trim().min(3).max(100),
    content: Joi.string().trim().min(3).max(1000),
};

const postValidationSchema = {
    search: Joi.object({
        q: Joi.string().trim().min(1).max(100),
        ...paginationValidationSchema,
    }),

    // For create, title and content are required
    create: Joi.object({
        title: baseValidationSchema.title.required(),
        content: baseValidationSchema.content.required(),
    }),

    // For update, title and content are optional
    update: Joi.object({
        ...baseValidationSchema,
    }),

    delete: Joi.object({

    })
}

module.exports = postValidationSchema;