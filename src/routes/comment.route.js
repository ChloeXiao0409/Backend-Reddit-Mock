const { Router } = require('express');
const { createComment,
    getCommentsByPostId,
    updateCommentById,
    deleteCommentById,  } = require('../controllers/comment.controller');
const authGuardMiddleware = require('../middleware/authGuard.middleware');
const { validateBody, validateQuery, validateObjectId } = require('../middleware/validation.middleware');
const commentValidationSchema = require('../validations/comment.validation');

const commentRouter = Router();

commentRouter.post('/', authGuardMiddleware, validateBody(commentValidationSchema.create), createComment);
commentRouter.get('/', validateQuery(commentValidationSchema.getCommentsById), getCommentsByPostId); // use / cus the postId in the query string
commentRouter.put("/:id", authGuardMiddleware, validateObjectId("id"), validateBody(commentValidationSchema.update), updateCommentById);
commentRouter.delete("/:id", authGuardMiddleware,validateObjectId("id"), deleteCommentById);

module.exports = commentRouter;