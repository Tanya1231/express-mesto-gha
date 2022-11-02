const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const auth = require('../middlewares/auth');

const {
  getUsers, getUserById, updateProfile, updateAvatar, getMyInfo,
} = require('../controllers/users');

const method = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  } throw new Error('URL validation err');
};

router.get('/', auth, getUsers);
router.get('/me', auth, getMyInfo);
router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), auth, getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), auth, updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(method).default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), auth, updateAvatar);

module.exports = router;
