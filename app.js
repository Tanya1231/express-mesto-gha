const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { userRoutes } = require('./routes/users');
const { cardRoutes } = require('./routes/cards');
const ErrorNotFound = require('./errors/ErrorNotFound');

const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(userRoutes);
app.use(cardRoutes);

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страницы не существует'));
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
