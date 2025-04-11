const { Router } = require('express');
const {
    createPost, 
    getAllPosts, 
    getPostById, 
    updatePostById, 
    deletePostById,
    getUserPostLikes
} = require('../controllers/post.controller');
const postValidationSchema = require('../validations/post.validation');
const { validateBody, validateQuery, validateObjectId } = require('../middleware/validation.middleware');

const postRouter = Router();

postRouter.get('/', validateQuery(postValidationSchema.search), getAllPosts);
postRouter.get('/:id', validateObjectId("id"), getPostById);
postRouter.put('/:id', validateBody(postValidationSchema.update), updatePostById);
postRouter.delete('/:id', validateObjectId("id"), deletePostById);
postRouter.post('/', validateBody(postValidationSchema.create), createPost);
postRouter.get('/:id/likes', validateObjectId('id'), getUserPostLikes);

module.exports = postRouter;