// app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const usersRouter = require('./routes/users');
const errorHandler = require('./middlewares/errorHandler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', usersRouter);
app.post('/signin', login);
app.post('/signup', createUser);
app.use(errorHandler);

app.listen(PORT, () => {
});
