const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoutes = express.Router();

const {
  getUsers, getUserById, updateProfile, updateAvatar, getMyInfo,
} = require('../controllers/users');

userRoutes.get('/users', getUsers);
userRoutes.get('/users/me', getMyInfo);
userRoutes.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

userRoutes.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

userRoutes.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/),
  }),
}), updateAvatar);

module.exports = { userRoutes };
