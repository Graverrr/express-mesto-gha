const router = require('express').Router();
const { login, createUser } = require('../controllers/users');

router.post('/signin', login);
router.post('/signup', createUser);
module.exports = router;
