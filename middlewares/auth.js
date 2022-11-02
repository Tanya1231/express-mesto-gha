/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

const auth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    let payload;
    try {
      payload = jwt.verify(token, 'SECRET');
    } catch (err) {
      return next(new ErrorUnauthorized('Необходима авторизация'));
    }
    req.user = payload; // записываем пейлоуд в объект запроса

    next(); // пропускаем запрос дальше
  } else {
    return next(new ErrorUnauthorized('Необходима авторизация'));
  }
};

module.exports = auth;
