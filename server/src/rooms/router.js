const express = require('express');

const roomRouter = express.Router();
const controller = require('./controller');
const authMiddleware = require('../middlewares/auth.middleware');

roomRouter.get('/', authMiddleware, controller.getAll);
roomRouter.post('/', authMiddleware, controller.createRoom);
roomRouter.get('/:roomId', authMiddleware, controller.getRoom);
roomRouter.post('/:roomId/join', authMiddleware, controller.joinRoom);
roomRouter.post('/:roomId/messages', authMiddleware, controller.addMessage);
roomRouter.get('/:roomId/messages', authMiddleware, controller.getMessages);

module.exports = roomRouter;
