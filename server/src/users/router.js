const express = require('express');

const userRouter = express.Router();
const controller = require('./controller');

userRouter.post('/signin', controller.login);

userRouter.post('/signup', controller.create);

userRouter.get('/', controller.getAll);

userRouter.delete('/:id', controller.remove);

module.exports = userRouter;
