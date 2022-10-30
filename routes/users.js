const router = require('express').Router();

const {
  getUsers, getUserById, createUser, updateProfile, updateAvatar, login, getMyInfo,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/:userId', auth, getUserById);
router.get('/me', auth, getMyInfo);
router.post('/signup', auth, createUser);
router.post('/signin', auth, login);
router.patch('/me', auth, updateProfile);
router.patch('/me/avatar', auth, updateAvatar);

module.exports = router;
