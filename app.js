// app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');
const { validateSignin, validateSignup } = require('./middlewares/validations');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', usersRouter);
app.post('/signin', validateSignin, login);
app.post('/signup', validateSignup, createUser);
app.use(errors);
app.use(errorHandler);

app.listen(PORT, () => {
});
