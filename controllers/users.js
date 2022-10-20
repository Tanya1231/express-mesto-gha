const User = require('../models/user');

const ERROR_CODE = 400;
const SUCCESSFULLY = 200;
const NOT_FOUND = 404;
const SERVER__ERROR = 500;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESSFULLY).send(users))
    .catch((err) => {
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию', err });
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
      res.status(SUCCESSFULLY).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию', err });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(SUCCESSFULLY).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию', err });
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
      res.status(SUCCESSFULLY).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны', err });
      } else {
        res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию', err });
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
      res.status(SUCCESSFULLY).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданные данные не валидны', err });
      } else {
        res.status(SERVER__ERROR).send({ message: 'Ошибка по умолчанию', err });
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
