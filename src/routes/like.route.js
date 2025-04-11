const { Router } = require('express');
const { validateBody, validateObjectId } = require('../middleware/validation.middleware');
const likeValidationSchema = require('../validations/like.validation');
const { createLike } = require('../controllers/like.controller');
const { deleteLikeById } = require('../controllers/like.controller');

const  likeRouter = Router();

likeRouter.post('/', validateBody(likeValidationSchema.create), createLike);
likeRouter.delete('/:id', validateObjectId('id'), deleteLikeById);

module.exports = likeRouter;