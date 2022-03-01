const bcrypt = require('bcryptjs');
const User = require('../models/user');
const {
  ERROR_CODE,
  ERROR_NOTFOUND,
  ERROR_DEFAULT,
} = require('../errors/errors');

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
      if (err.message === 'NotValidId') {
        res.status(ERROR_NOTFOUND).send({ message: 'Пользователь по указанному id не найден' });
      } else if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Невалидный id ' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: '«На сервере произошла ошибка»' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash, // записываем хеш в базу
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные  пользователя. ' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: '«На сервере произошла ошибка»' });
      }
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).send({ message: 'Не верный email или пароль' });
      }
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Не верный email или пароль'));
          }
          res.status(200).send({ _id: user._id });
        });
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
