const jwt = require('jsonwebtoken');
const ErrorUnauthorized = require('../errors/ErrorUnauthorized');

const auth = (req, res, next) => {
  const token = req.cookies.accent_token;
  if (!token) {
    next(new ErrorUnauthorized('Необходима авторизация'));
  }
  let payload;
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    next(new ErrorUnauthorized('Необходима авторизация'));
    return;
  }
  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = { auth };
