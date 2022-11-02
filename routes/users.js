const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');

const userRoutes = express.Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getMyInfo,
} = require('../controllers/users');
const auth = require('../middlewares/auth');

userRoutes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), login);

userRoutes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/),
    email: Joi.string().required().email({ tlds: { allow: false } }),
    password: Joi.string().required(),
  }),
}), createUser);
userRoutes.get('/users', auth, getUsers);
userRoutes.get('/users/:userId', auth, getUserById);
userRoutes.get('/users/me', auth, getMyInfo);
userRoutes.patch('/users/me', auth, updateProfile);
userRoutes.patch('/users/me/avatar', auth, updateAvatar);

module.exports = { userRoutes };
