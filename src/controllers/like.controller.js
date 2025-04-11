const PostModel = require('../models/post.model');
const CommentModel = require('../models/comment.model');
const LikeModel = require('../models/like.model');
const ConflictsException = require('../exceptions/conflict.exception');
const NotFoundException = require('../exceptions/notFound.exception');
const ForbiddenException = require('../exceptions/forbidden.exception');

/**
 * 2 path for resolve likes: 
 * - like a post: POST /posts/:postId/likes
 * - like a comment: POST /comments/:commentId/likes
 * 
 * Another option is to use a single path for both likes:
 * POST /likes -> body:{}
 */

// Func 01: Create like

const createLike = async (req, res, next) => {
    // We must need targetType, targetId, but optional for userId -> req.user.id, postId -> already be stored in the post itself and comment related
    try {
        // targetType: Post or Comment, targetId: postId or commentId
        const { targetId, targetType } = req.body; 
        const Model = targetType === 'Post' ? PostModel : CommentModel;
        const target = await Model.findByIdOrFail(targetId);
        let postId;
        if(targetType === 'Post') {
            postId = target._id;
        } else {
            postId = target.post; // CommentModel has a post field with ObjectId that references the PostModel
        }

        // 01 Check if the like already exists
        const userId = req.user.id;
        const existingLike = await LikeModel.findOne(
            { user: userId, targetId: targetId, targetType, }
        );
        if(existingLike) {
            throw new ConflictsException('Like already exists');
        }
        // if not, create a new like
        const like = new LikeModel({
            user: userId,
            post: postId,
            targetId: targetId,
            targetType,
        });
        await like.save(); 

        // 02 Update the post and comment with the new like
        await Model.findByIdAndUpdate(
            targetId, // targetId is postId or commentId
            {
                $inc: { likesCount: 1 }, // increment the likesCount by 1
            }, 
        ).exec(); // execute the query

        // 03 Send the response
        res.status(201).json({
            success: true,
            data: like,
        })

    } catch(error) {
        next(error);
    }
}

// Func 02: Delete like - DELETE /likes/:likeId
// In the backend, delete like by using id is the easilest way, but in the frontend, we need to know the postId and commentId to delete the like.
const deleteLikeById = async ( req, res, next) => {
    try {
        const { id } = req.params;
        const like = await LikeModel.findById(id).exec();
        if(!like) {
            throw new NotFoundException('Like not found');
        }
        // 01 Check if the user is the owner of the like
        if(like.user.toString() !== req.user.id) {
            throw new ForbiddenException('You are not allowed to delete this like');
        }
        //  02 Delete the like from the database
        await like.deleteOne(); 

        //  03 Update the post and comment with the deleted like
        const Model = like.targetType === 'Post' ? PostModel : CommentModel;
        await Model.findByIdAndUpdate(like.targetId, 
            {
                $inc: { likesCount: -1 }, // decrement the likesCount by 1
            }
        ).exec(); // execute the query
        // 04 Send the response
        res.sendStatus(204); // No Content

    } catch(error) {
        next(error);
    }
}

module.exports = {
    createLike,
    deleteLikeById,
}