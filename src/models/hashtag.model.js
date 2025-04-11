const mongoose = require('mongoose');

const hashtagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        match: [
            /^[a-zA-Z0-9_]+$/, // 01 - Regex
            'Hashtag can only contain letters, numbers and underscores', // 02 - Message
        ]
    },
    postsCount: {
        type: Number,
        default: 0,
    },
    // Bi-directional referencing (hashtag <-> post) [array]
    recentPosts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ],
}, {
    timestamps: true,
})

const MAX_RECENT_POSTS = 2; // Maximum number of recent posts to keep

// Using statics method for Hashtag model to create or update a hashtag by name
hashtagSchema.statics.createOrUpdateHashtagByName = async function(tagName, postId) {
    // findOneAndUpdate({filter}, {update operator}, {options})
    const hashtag = await this.findOneAndUpdate(
        {name: tagName}, 
        {
            $inc: {postsCount: 1}, // Increment postsCount by 1 if the hashtag exists
            $push: {
                recentPosts: {
                    $each: [postId], // Add the postId to the recentPosts array
                    $slice: -MAX_RECENT_POSTS, // Keep only the last 2 posts in the array
                }
            }
        }, 
    // upsert: true will create a new document if it doesn't exist
    // new: true will return the updated document
    {upsert: true, new: true});
    return hashtag;
}

module.exports = mongoose.model('Hashtag', hashtagSchema);