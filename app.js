const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { createUser, login } = require('./controllers/users');
const { auth } = require('./middlewares/auth');

const NOT_FOUND = 404;

const { PORT = 3000 } = process.env;
const app = express();
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
//  app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.json());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]+\.[a-zA-Z0-9()]+([-a-zA-Z0-9()@:%_\\+.~#?&/=#]*)/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страницы не существует' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'Ошибка по умолчанию' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
