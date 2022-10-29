const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;
  if (!token) {
    res.status(401).send({ message: 'Необходима авторизация' });
  }
  try {
    payload = jwt.verify(token, 'super-strong-secret');
  } catch (err) {
    res.status(401).send({ message: 'Необходима авторизация' });
    return;
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};

module.exports = { auth };
