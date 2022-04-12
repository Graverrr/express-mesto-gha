const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const { SALT_ROUNDS, JWT_SECRET } = require('../config/index');

module.exports.getUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('NotValidId'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.kind === 'ObjectId' || err.message === 'NotValidId') {
        next(new NotFoundError('Пользователь не найден'));
      } else if (err.user === 'CastError') {
        next(new ValidationError('Ошибка данных'));
      } else {
        next(err);
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = async (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  if (!email || !password) {
    next(new ValidationError('Неверный логин или пароль'));
  }
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError(`Пользователь ${email} уже зарегестрирован`);
      }
      return bcrypt.hash(password, SALT_ROUNDS);
    })
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Невреный логин или пароль');
      }
      return bcrypt.compare(password, user.password);
    })
    .then((isValid) => {
      if (!isValid) {
        throw new UnauthorizedError('Невреный логин или пароль');
      }

      const token = jwt.sign({ email }, JWT_SECRET);
      res.send({ jwt: token });
    })
    .catch(() => {
      next();
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const id = req.user._id;
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: 'Поля "name" и "about" должно быть заполнены' });
  }
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const id = req.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Поле "Avatar" должно быть заполенено' });
  }
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new ValidationError(err.message));
      } else {
        next(err);
      }
    });
};
