require('dotenv').config();

const express = require('express');

const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const users = require('./users');
const userRouter = require('./users/router');
const roomsRouter = require('./rooms/router');
const socket = require('./socket');
const mysqlService = require('./services/sql');

async function init() {
  await mysqlService.init();

  app.use(
    bodyParser.urlencoded({
      extended: true,
    }),
  );
  app.use(express.json());
  app.use(cors());

  app.post('/login', users.controller.login);
  app.use('/users', userRouter);
  app.use('/rooms', roomsRouter);

  app.listen(4332, () => {
    console.info('This app is on port 4332!');
  });

  socket.init(app);
}

init();
