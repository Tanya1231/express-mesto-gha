const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
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
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
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
        res.status(400).send({ message: 'Ошибка по умолчанию', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.id, { avatar })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'User с указанным _id не найдена' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданные данные не валидны', err });
        return;
      }
      res.status(500).send({ message: 'Ошибка по умолчанию', err });
    });
};
