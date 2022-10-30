const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCode = require('../errors/ErrorCode');
const ErrorConflict = require('../errors/ErrorConflict');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorServer = require('../errors/ErrorServer');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => next(new ErrorServer('Ошибка по умолчанию')));
};

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  User.findById({ _id: userId })
    .then((user) => {
      if (user === null) {
        next(new ErrorNotFound('User с указанным _id не найдена'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ErrorCode('Переданные данные не валидны'));
        return;
      }
      next(new ErrorServer('Ошибка по умолчанию'));
    });
};

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hashedPassword = bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorNotFound('Переданные данные не валидны'));
    }
    if (err.code === 1000) {
      return next(new ErrorConflict('Пользователь с указанным email не найден'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        next(new ErrorNotFound('User с указанным _id не найдена'));
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ErrorCode('Переданные данные не валидны'));
      }
      return next(new ErrorServer('Ошибка по умолчанию'));
    });
};

const login = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorUnauthorized('Неверно введена почта или пароль'));
    }
    const userValid = bcrypt.compare(password, user.password);
    if (!userValid) {
      return next(new ErrorUnauthorized('Неверно введена почта или пароль'));
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key');
    res.cookie('jwt', token, { expiresIn: '7d' });
    return res.status(200).send(user.toJSON());
  } catch (err) {
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const getMyInfo = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorNotFound('Указанный пользователь не найден'));
    }
    return res.send(user);
  } catch (err) {
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        return next(new ErrorNotFound('User с указанным _id не найдена'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return next(new ErrorCode('Переданные данные не валидны'));
      }
      return next(new ErrorServer('Ошибка по умолчанию'));
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getMyInfo,
};
