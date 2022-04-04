const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const auth = require('./auth');

router.use(auth);
router.use('/users', auth, userRouter);
router.use('/cards', auth, cardRouter);

router.use((req, res) => {
  res.status(404).send({ message: 'Такого роута не существует' });
});

module.exports = router;
