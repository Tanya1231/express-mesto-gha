const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию', err });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
      } else {
        res.status(500).send({ message: 'Ошибка по умолчанию', err });
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
