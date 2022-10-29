const mongoose = require('mongoose');

const validator = require('validator');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    default: 'Жак-Ив-Кусто',
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    required: [true, 'Обязательное поле'],
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://chance4traveller.com/wp-content/uploads/2021/02/b96ce22cfdae9849ce9daeb32b5b4da3.jpg',
    required: [true, 'Обязательное поле'],
    validate: {
      validator(v) {
        return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w._]*)*\/?$/.test(v);
      },
      message: 'Ошибка ссылка невалидна',
    },
  },
  email: {
    type: String,
    required: [true, 'Обязательное поле'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Неверно заполнен email',
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательное поле'],
    select: false,
  },
}, {
  versionKey: false,
});

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('user', userSchema);
