const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const authRouter = require('./auth');

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/cards', cardRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'Такого роута не существует' });
});

module.exports = router;
