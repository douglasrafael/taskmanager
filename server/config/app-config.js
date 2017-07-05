const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./passport');

const app = express();

const allowCors = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:4200');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Accept-Charset', 'utf-8');
  res.header('Access-Control-Allow-Credentials', true);

  next();
};

// Use the passport package in our application
app.use(passport.initialize());

// Parsers para dados vindos do POST, PUT
app.use(allowCors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Apontar o caminho estático para dist
app.use(express.static(path.join(__dirname, 'dist')));

// Pegue todas as outras rotas e devolve arquivo index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

module.exports = app;