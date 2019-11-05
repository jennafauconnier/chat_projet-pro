const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../users/controller');

async function authMiddleware(req, res, next) {
  const token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : undefined;

  jwt.verify(token, JWT_SECRET, (err, decryptedToken) => {
    if (!decryptedToken || err) {
      res.status(403).send('Forbidden');
      return;
    }
    req.__user = decryptedToken;
    next();
  });
}

module.exports = authMiddleware;
