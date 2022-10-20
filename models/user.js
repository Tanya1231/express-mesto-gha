const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    require: true,
  },
  avatar: {
    type: String,
    require: true,
  },
}, {
  versionKey: false,
});

module.exports = mongoose.model('user', userSchema);
