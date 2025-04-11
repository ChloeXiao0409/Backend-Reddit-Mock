const PostModel = require('../models/post.model');
const NotFoundException = require('../exceptions/notFound.exception');
const ForbiddenException = require("../exceptions/forbidden.exception");
const commentModel = require('../models/comment.model');
const HashtagModel = require('../models/hashtag.model');
const LikeModel = require('../models/like.model');

// -----------------------------------------------
// Function 1: Create a new post

const createPost = async (req, res, next) => {
    try {
        const { title, content } = req.body;
        // Method 1:
        // 1. Create a mongoose post instance
        const post = new PostModel({
            title,
            content,
            user: req.user.id // Cus authController has write the user id to req.body and the authGuard has checked the user is logged in, it can be read directly from req.body
        });
        // 2. Save the post to the database
        // await post.save();

        // Method 2:
        // const post = await PostModel.create({
        //     title,
        //     content,
        //     user: req.user.id,
        // });

        // Hashtag Function
        // 1. Extract hashtags from the content using regex
        const hashtags = extractHashtags(content);
        // 2. Map through the hashtags and create a new hashtag document for each one
        //  - Check if the hashtag already exists in the database -> hashtag model
        if (hashtags.length > 0) {
            const hashtagDocs = await Promise.all(
                hashtags.map(async (h) => {
                    const hashtagDoc = await HashtagModel.createOrUpdateHashtagByName(h, post._id);
                    return hashtagDoc;
                })
            );
            post.hashtags = hashtagDocs.map((d) => d._id);
        }
        // Save the post again to update it with the hashtags
        await post.save();

        res.status(201).json({
            success: true,
            data: post,
        })

    } catch (error) {
        next(error);
    }
};

// -----------------------------------------------
// Function 2: Get all posts - MUST consider pagination

const getAllPosts = async (req, res, next) => {
    try {
        const {page, limit, q} = req.query;

        // 01 - Query string search
        // $search is only for completed matching, not partial matching
        // $regex is for partial matching
        /**
         * The ternary operator checks if q exists: If q is truthy (i.e., the client provided a search term), the query object becomes: 
         *  - $text: A MongoDB operator used to perform text searches on fields that are part of a text index. 
         *  - $search: A sub-operator of $text that specifies the search term.
         * If q is falsy (i.e., no search term was provided), the query object becomes an empty object
         */
        const searchQuery = q ? {$text: {$search: q}} : {};

        // 02 - Pagination 
        // .skip((page - 1) * limit): skips a certain number of documents based on the current page and the limit (number of items per page)
        // .limit(limit): limits the number of documents returned to the value of limit
        // .exec(): executes the query and returns a promise, allowing you to use await to wait for the results.
        const posts = await PostModel.find(searchQuery)
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();

        // Count the total number of posts in the database
        const total = await PostModel.countDocuments().exec();

        res.json({
            success: true,
            data: posts,
            // pagination: {page, limit, total, totalPage}
            // Now using Infinite scroll -> no need to return totalPage -> if the post array length < limit, it means the last page
        })
    } catch (error) {
        next(error);
    }
};

// -----------------------------------------------
// Function 3: Get a post by ID

const getPostById = async (req, res, next) => {
    try {
        //For adding data relationship, figure out who send this post, we want to know the user, we can use the populate() method.
     const post = await PostModel.findById(req.params.id)
          // TODO: add population
        .populate('user', 'username') // Projection -> return what -> only return the username field of the user
        .exec();

        // Check if the post exists
        if(!post) {
            throw new NotFoundException(`Post not found: ${req.params.id}`);
        }

     res.json({
        success: true,
        data: post,
     })

    } catch (error) {
        next(error);
    }
}

// -----------------------------------------------
// Function 4: Update a post by ID

const updatePostById = async (req, res, next) => {
    try {
        const {content} = req.body;
        // Using the findByIdOrFail method set up in model schema to find the post by ID and throw an error if not found
        const post = await PostModel.findByIdOrFail(req.params.id);
        // Then wont need the below code:
        // Check if the post exists
        // if(!post) {
        //     throw new NotFoundException(`Post not found: ${req.params.id}`);
        // }
        // set() will ignore undefined fields
        checkUserOwnsPost(post, req.user.id); // Check if the user owns the post before updating

        // Update hashtags
        const newHashtags = extractHashtags(content);
        // 1. Get the current hashtags from the post document
        await post.populate('hashtags'); 
        // 2. Get the current hashtags from the populated document
        const oldHashtags = post.hashtags.map(({name}) => name);
        const {addedHashtags, removedHashtags} = getHashtagDiffs(oldHashtags, newHashtags); // Get the added and removed hashtags

        if(addedHashtags.length > 0 || removedHashtags.length > 0) {
            // 01 - Add the new hashtags to the post document
            const addedhashtagDocs = addedHashtags.length > 0 ? await Promise.all(
                addedHashtags.map(async (h) => {
                    return await HashtagModel.createOrUpdateHashtagByName(h, post._id);
                })
            ) : [];
            // 02 - Remove the old hashtags from the post document
            if(removedHashtags.length > 0) {
                // Retrieve the IDs of the removed hashtags from the post document
                const removedHashtagIds = post.hashtags.filter((tag) => removedHashtags.includes(tag.name)).map((tag) => tag._id);
                await HashtagModel.updateMany(
                    {
                        _id: {$in: removedHashtagIds},
                    },
                    {
                        $pull: {
                            recentPosts: post._id, // Retrieve the post ID from the recentPosts array of the hashtags
                        },
                        $inc: {
                            postsCount: -1, // Decrement the postsCount of the hashtags
                        }
                    },
                ).exec();
            }
            // 3. Update the post document with the new hashtags: remianing hashtags(old - remove) + added hashtags
            const remianingHashtagIds = post.hashtags.filter((tag) => !removedHashtags.includes(tag.name)).map((tag) => tag._id);
            post.hashtags = [
                ...addedhashtagDocs.map((doc) => doc._id),
                ...remianingHashtagIds,
            ];
        }

        post.set(req.body); // Update the post with the new data from req.body
        await post.save();

        res.json({
            success: true,
            data: post,
        })

    } catch (error) {
        next(error);
    }
}

// ---------------------------------------------------
// Function 5: Delete a post by ID

const deletePostById = async (req, res, next) => {
    try {

        const post = await PostModel.findByIdOrFail(req.params.id);
        checkUserOwnsPost(post, req.user.id); // Check if the user owns the post before updating
        await post.deleteOne(); // Delete the post from the database

        // Simutaniously delete all tags related to this post
        await HashtagModel.updateMany(
            {
                _id: {$in: post.hashtags}, // Find all hashtags related to this post
            },
            {
                $pull: {
                    recentPosts: post._id, // Retrieve the post ID from the recentPosts array of the hashtags
                },
                $inc: {
                    postsCount: -1, // Decrement the postsCount of the hashtags
                }
            }
        )

        // Delete all comments related to this post simultaneously
        await commentModel.deleteMany({post: post._id}).exec();

        res.sendStatus(204); // No content to send back, delete successful

    } catch (error) {
        next(error);
    }
}

// ---------------------------------------------------
// Function 6: get user's post likes -> GET /posts/:postId/likes/me
const getUserPostLikes = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const likes = await LikeModel.find(
            {user: userId, post: id}
        ).exec();
        // Filter like get from post or comment
        let postLike = null;
        let commentLikes = [];
        likes.forEach((like) => {
            if(like.targetType === 'Post') {
                postLike = like._id;
            } else {
                commentLikes.push(like._id);
            }
        })

        const response = {
            post: postLike,
            comments: commentLikes
        }

        res.json({success: true, data: response});
    } catch (error) {
        next(error);
    }
}



// ---------------------------------------------------
// 01 - Helper Func for check user owns the post resource
 //Check user owns this post resource -> both update and delete need to check -> it can be created a new function
 // post -> mongoose document
    const checkUserOwnsPost = (post, userId) => {
        if(post.user.toString() !== userId) {
            throw new ForbiddenException(`You are not allowed to modify this post`);
        }
    } 

// 02 - Helper Func for extract hashtags from content by using regex (e.g. #hashtag1, #hashtag2)
    const extractHashtags = (content) => {
        // 01 - Start with #, followed by one or more alphanumeric characters or underscores
        const hashtags = content.match(/#[a-zA-Z0-9_]+/g) || [];
        // 02 Set a array -> remove # and create a unique set of hashtags remove duplicates
        // 03 Convert the set back to an array and return
        return [...new Set(hashtags.map(h => h.slice(1)))];
    }

// 03 - Helper func for identify different hashtags between old and new hashtags
    const getHashtagDiffs = (oldHashtags, newHashtags) => {
        const oldHashtagsSet = new Set(oldHashtags);
        const newHashtagsSet = new Set(newHashtags);
        const addedHashtags = newHashtags.filter((tag) => !oldHashtagsSet.has(tag));
        const removedHashtags = oldHashtags.filter((tag) => !newHashtagsSet.has(tag));
        return {addedHashtags, removedHashtags};
    };


module.exports = {
    createPost,
    getAllPosts,
    updatePostById,
    getPostById,
    deletePostById,
    getUserPostLikes,
}