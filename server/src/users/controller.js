const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('../services/sql');

const BCRYPT_SALT_ROUNDS = 10;
const JWT_SECRET = 'Os7èsSAàDOijqdspoUk';

const getAll = async (req, res) => {
  const knex = sql.get();
  try {
    const users = await knex('users').select(['id', 'username']);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const create = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send();
  }

  const hash = await bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
  // je créé un objet qui va me permettre de recuperer ce que l'utilisateur rentre suivant le model
  const newUser = {
    username,
    password: hash,
  };

  const knex = sql.get();

  try {
    const [user] = await knex('users').insert(newUser, ['id', 'username']);
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  let isSamePassword;
  let user;

  const knex = sql.get();

  try {
    const users = await knex('users').where({ username }, '*');
    user = users[0];
    if (!user) {
      return res.status(401).send();
    }
    isSamePassword = await bcrypt.compareSync(password, user.password);

    if (!isSamePassword) {
      return res.status(401).send();
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      JWT_SECRET,
      { expiresIn: '3 hours' },
    );
    res.status(200).send({ token });
  } catch (error) {
    res.status(401).send({});
  }
};

const remove = async (req, res) => {
  const knex = sql.get();

  try {
    await knex('users')
      .where({ id: req.params._id })
      .del();
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  create,
  login,
  getAll,
  remove,
  JWT_SECRET,
};
