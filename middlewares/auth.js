const jwt = require('jsonwebtoken');
// const Unauthorized = require('../errors/UnauthorizedError');
const { JWT_SECRET } = require('../config/index');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports = (req, res, next) => {
  const token = String(req.headers.authorization).replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    next(new ForbiddenError('Недостаточно прав'));
  }
};
