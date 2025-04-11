const CommentModel = require('../models/comment.model');
const PostModel = require('../models/post.model');
const ForbiddenException = require('../exceptions/forbidden.exception');
const NotFoundException = require('../exceptions/notFound.exception');


// -----------------------------------------------
// Function 1: Create a new comment
// POST - /posts/:postId/comments
// POST - /comments/:id   body -> {postId} ✅
const createComment = async (req, res, next) => {
    try {
        // customize the varaible name to be more descriptive
        // 01 - Extract content and postId from the request body
        const { content, post:postId } = req.body; 
        // 02 - Check if the post exists
        await PostModel.findByIdOrFail(postId);
        // 03 - Create a new comment
        const comment = new CommentModel({
            content,
            post: postId, //post._id
            user: req.user.id,
        })
        await comment.save(); // SAVE!!

        //TODO: update post's commentsCount
        await PostModel.findByIdAndUpdate(postId, {$inc: {commentsCount: 1}}); // increment the commentsCount by 1

        // 04 - Send the response
        res.status(201).json({
            success: true,
            data: comment,
        });
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------
// Function 2: Get all comments for a post
const getCommentsByPostId = async (req, res, next) => {
    try {
        // 01 - Extract postId, page and limit from the request parameters
        const {post:postId, page, limit} = req.query;
        // 02 - Check if the post exists
        await PostModel.findByIdOrFail(postId);
        // 03 - Query the comments for the post
        const comments = await CommentModel.find({post: postId})
            .skip((page - 1) * limit) // Skip the number of comments based on the page and limit
            .limit(limit) // Limit the number of comments returned
            .populate("user", "username") // Populate the user field with the username
            .sort({createdAt: -1}) // Sort the comments by createdAt in descending order
            .exec(); 

        // 04 - Send the response
        res.json({
            success: true,
            data: comments,
        })
    } catch (error) {
        next(error);
    }
};

// ---------------------------------------------------
// Function 3: Update a comment by id
const updateCommentById = async (req, res, next) => {
    try {
        // 01 - Check if the comment exists
        const comment = await CommentModel.findByIdOrFail(req.params.id);
        // 02 - Check if the user is the owner of the comment
        checkUserOwnsComment(comment, req.user.id);
        // 03 - Update the comment
        comment.set(req.body);
        await comment.save(); // SAVE!!
        // 04 - Send the response
        res.json({
            success: true,
            data: comment,
        })
        
    } catch (error) {
        next(error);
    }
}


// ---------------------------------------------------
// Function 4: Delete a comment by id
const deleteCommentById = async (req, res, next) => {
    try {
        // 01 - Check if the comment exists
        const comment = await CommentModel.findByIdOrFail(req.params.id);
        // 02 - Check if the user is the owner of the comment
        checkUserOwnsComment(comment, req.user.id);
        // 03 - Delete the comment
        await comment.deleteOne();
        // TODO: update post's commentsCount
        await PostModel.findByIdAndUpdate(comment.post, {$inc: {commentsCount: -1}}); // increment the commentsCount by -1
        // 04 - Send the response
        res.sendStatus(204); // No content

    } catch (error) {
        next(error);
    }
}

const checkUserOwnsComment = (comment, userId) => {
    if (comment.user.toString() !== userId) {
        throw new ForbiddenException("You are not allowed to modify this comment.");
    }
};

module.exports = {
    createComment,
    getCommentsByPostId,
    updateCommentById,
    deleteCommentById,
}