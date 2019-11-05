const io = require('../socket');
const sql = require('../services/sql');

// création de la route qui permet de rejoindre une room
const getAll = async (req, res) => {
  const knex = sql.get();
  try {
    const rooms = await knex('rooms').select(['id', 'name']);
    res.status(200).send({ rooms });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createRoom = async (req, res) => {
  const knex = sql.get();
  try {
    const [room] = await knex('rooms').insert({ name: req.body.name }, '*');
    await knex('room_user').insert({
      room_id: room.id,
      user_id: req.__user.id,
    });
    const socket = io.getSocketById(req.__user.id);
    if (socket) {
      socket.join(room.name);
    }
    res.status(200).send(room);
  } catch (error) {
    res.status(500).send(error);
  }
};

const joinRoom = async (req, res) => {
  try {
    const knex = sql.get();
    const [existingRoom] = await knex('rooms').where({ id: req.params.roomId });
    if (!existingRoom) {
      return res.status(404).send();
    }
    const roomUser = {
      room_id: existingRoom.id,
      user_id: req.__user.id,
    };

    const [hasRoomRelation] = await knex('room_user').where(roomUser);
    if (hasRoomRelation) {
      return res.status(200).send();
    }

    const socket = io.getSocketById(req.__user.id);
    socket.join(existingRoom.name);
    await knex('room_user').insert(roomUser);
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

const addMessage = async (req, res) => {
  try {
    const knex = sql.get();
    const [message] = await knex('messages').insert(
      {
        user_id: req.__user.id,
        room_id: req.params.roomId,
        text: req.body.message,
      },
      '*',
    );
    const [room] = await knex('rooms').where({ id: req.params.roomId }, 'name');
    io.get()
      .in(room.name)
      .emit('MESSAGE', {
        ...message,
        username: req.__user.username,
      });
    res.status(200).send(message);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getMessages = async (req, res) => {
  try {
    const knex = sql.get();
    const messages = await knex('messages')
      .where({ room_id: req.params.roomId })
      .innerJoin('users', 'user_id', 'users.id')
      .select(['messages.id', 'username', 'room_id', 'text', 'date']);

    res.status(200).send(messages);
  } catch (error) {
    res.status(500).send(500);
  }
};

const getRoom = async (req, res) => {
  try {
    const knex = sql.get();
    const [room] = await knex('rooms').where({ id: req.params.roomId }, '*');
    const [{ count }] = await knex('room_user')
      .where({ room_id: req.params.roomId })
      .count('*');
    res.status(200).send({ ...room, usersCount: count });
  } catch (error) {
    res.status(500).send(500);
  }
};

module.exports = {
  getRoom,
  getAll,
  createRoom,
  addMessage,
  getMessages,
  joinRoom,
};
