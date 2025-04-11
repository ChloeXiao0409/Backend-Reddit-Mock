const mongoose = require('mongoose');
const NotFoundException = require('../exceptions/notFound.exception');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxLength: 100,
            trim: true,
        },
        content: {
            type: String,
            required: true,
            maxLength: 1000,
        },
        user: {
            // Set up a related ObjectId reference to the User model
            type: mongoose.Schema.Types.ObjectId, // _id is default as ObjectId type
            // The reference name MUST match the model name created in Schema
            ref: "User",
            required: true,
        },
        commentsCount: {
            type: Number,
            default: 0,
        },
        likesCount: {
            type: Number,
            default: 0,
        },
        hashtags: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Hashtag",
            }
        ]
    },
    {
        timestamps: true, // createdAt and updatedAt fields
    }
);

// Mongoose schema can have customized methods for models
postSchema.statics.findByIdOrFail = async function(id) {
    const post = await this.findById(id).exec();
    if(!post) {
        throw new NotFoundException(`Post not found with id: ${id}`);
    }
    return post;
}

// if use $text operation in controller then search need an index 
postSchema.index({
    title: "text",
    content: "text",
})

module.exports = mongoose.model("Post", postSchema);