const User = require('../models/user');
const { ERROR_CODE, NOT_FOUND, SERVER__ERROR } = require('../utils/utils');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res.send({ message: 'Ошибка по умолчанию' });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны' });
        return;
      }
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны' });
        return;
      }
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны' });
      } else {
        res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(NOT_FOUND).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны' });
      } else {
        res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию' });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
