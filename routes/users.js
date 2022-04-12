const router = require('express').Router();
const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getUser,
} = require('../controllers/users');
const {
  validateUser,
  validateAvatar,
  validateUserId,
} = require('../middlewares/validations');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', getUser);
router.get('/:id', validateUserId, getUserById);
router.patch('/me', validateUser, updateUserInfo);
router.patch('/me/avatar', validateAvatar, updateUserAvatar);

module.exports = router;
