const http = require('http');
const socketio = require('socket.io');
const jwt = require('jsonwebtoken');
const sql = require('./services/sql');
const { JWT_SECRET } = require('./users/controller');

let io;

function init(app) {
  const httpServer = http.createServer(app);
  io = socketio(httpServer);

  io.use(async (socket, next) => {
    const token = socket.handshake.query.token;

    jwt.verify(token, JWT_SECRET, async function(err, decryptedToken) {
      if (!decryptedToken || err) {
        socket.disconnect();
        return;
      }
      socket.__user = {
        id: decryptedToken.id,
        name: decryptedToken.username,
      };
      // get all rooms for a user_id and join all rooms for this socket
      const knex = sql.get();
      const userRooms = await knex('room_user')
        .where({
          user_id: decryptedToken.id,
        })
        .innerJoin('rooms', 'room_id', 'rooms.id')
        .select('rooms.name');
      userRooms.forEach(userRoom => {
        socket.join(userRoom.name);
      });
      return next();
    });
  });

  io.on('connection', function(socket) {
    console.log(`New socket connected for user ${socket.__user.id}`);
  });

  httpServer.listen(3007, function() {
    console.log('listening on *:3007');
  });
}

function getSocketById(id) {
  const sockets = Object.values(io.sockets.clients().sockets);
  const matchingSocket = sockets.find(socket => socket.__user.id === id);
  return matchingSocket;
}

function get() {
  return io;
}

module.exports = {
  init,
  get,
  getSocketById,
};

// connexion a un fichier socketio pour éviter une dépendance ciruculaire
