const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const UnauthorizedError = require('../errors/UnauthorizedError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');
const ValidationError = require('../errors/ValidationError');
const { SALT_ROUNDS, JWT_SECRET } = require('../config/index');
const {
  ERROR_CODE,
  ERROR_NOTFOUND,
  ERROR_DEFAULT,
} = require('../errors/errors');

module.exports.getUser = (req, res, next) => {
  const owner = req.user._id;
  User.findById(owner)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Такого пользователя не существует');
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = async (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('NotValidId'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === '') {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь по указанному id не найден' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Невалидный id ' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: '«На сервере произошла ошибка»' });
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

module.exports.updateUserInfo = (req, res) => {
  const id = req.user._id;
  const { name, about } = req.body;
  if (!name || !about) {
    return res.status(400).send({ message: 'Поля "name" и "about" должно быть заполнены' });
  }
  return User.findByIdAndUpdate(id, { name, about }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const id = req.user._id;
  const { avatar } = req.body;
  if (!avatar) {
    return res.status(400).send({ message: 'Поле "Avatar" должно быть заполенено' });
  }
  return User.findByIdAndUpdate(id, { avatar }, { new: true, runValidators: true })
    .orFail(new Error('NotValidId'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь по указанному _id не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Ошибка по умолчанию.' });
      }
    });
};
