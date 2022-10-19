const mongoose = require('mongoose');
const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch(() => {
      res.status(500).send({ message: 'Ошибка по умочанию' });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId).orFail(new Error('NotFound'))
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные профиля' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умочанию' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные для создания профиля' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умочанию' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные для обновления профиля' });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умочанию' });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные для обновления аватара', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умочанию' });
    });
};
