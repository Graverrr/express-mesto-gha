// app.js
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});
app.use('/', require('./routes/users'));
app.use((req, res, next) => {
  req.user = {
    _id: '62096c17d70bb036a5696167' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});


app.listen(PORT, () => {
  console.log('123');
});