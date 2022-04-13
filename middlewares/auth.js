const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../config/index');
// const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (req, res, next) => {
  const authorization = String(req.headers.authorization);
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Невреный логин или пароль');
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }
};
