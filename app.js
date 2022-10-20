const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;
mongoose.connect(MONGO_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '634d39e2b11dab6130b7d997', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
