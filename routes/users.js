const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users', getUserById);
router.post('/users', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;