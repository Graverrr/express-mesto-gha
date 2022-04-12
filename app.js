// app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use('/', usersRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
});
