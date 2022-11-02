const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorCode = require('../errors/ErrorCode');
const ErrorConflict = require('../errors/ErrorConflict');
const ErrorNotFound = require('../errors/ErrorNotFound');
const ErrorServer = require('../errors/ErrorServer');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

const createUser = async (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new ErrorCode('Переданные данные не валидны'));
    }
    if (err.code === 11000) {
      return next(new ErrorConflict(`Пользователь с указанным email ${email} уже существует`));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.send(users);
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

const getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = User.findById({ userId });
    if (user === null) {
      return next(new ErrorNotFound('User с указанным _id не найдена'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      return next(new ErrorCode('Переданные данные не валидны'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  const owner = req.user._id;
  try {
    const user = User.findByIdAndUpdate(owner, { name, about }, { new: true, runValidators: true });
    if (user === null) {
      return next(new ErrorNotFound('User с указанным _id не найдена'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new ErrorCode('Переданные данные не валидны'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (user === null) {
      return next(new ErrorNotFound('User с указанным _id не найдена'));
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      return next(new ErrorCode('Переданные данные не валидны'));
    }
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorUnauthorized('Неверно введена почта или пароль'));
    }
    const userValid = await bcrypt.compare(password, user.password);
    if (!userValid) {
      return next(new ErrorUnauthorized('Неверно введена почта или пароль'));
    }
    const token = jwt.sign({
      _id: user._id,
    }, 'SECRET');
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: true,
    });
    return res.status(200).send(user.toJSON());
  } catch (error) {
    return next(new ErrorServer('Ошибка по умолчанию'));
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getMyInfo,
  updateProfile,
  updateAvatar,
  login,
};
