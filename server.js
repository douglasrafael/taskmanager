'use strict';

// Obtendo as dependencias
const path = require('path');
<<<<<<< HEAD
=======
const http = require('http');
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('./server/config/passport')(require('passport'));

// stating db
const db = require('./server/config/db-config');

const app = express();

const allowCors = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.header('Accept-Charset', 'utf-8');
<<<<<<< HEAD
    res.header('Access-Control-Allow-Credentials', true);
=======
    res.header('Access-Control-Allow-Credentials', 'true');

>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
    next();
};

/**
 * Parsers para dados POST
 */
app.use(allowCors);
app.use(bodyParser.json());
<<<<<<< HEAD
=======
app.use(bodyParser.urlencoded({ extended: false }));
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

// Use the passport package in our application
app.use(passport.initialize());

// Apontar o caminhos estáticos
<<<<<<< HEAD
app.use(express.static(path.resolve('dist')));
=======
app.use(express.static(path.resolve('./server/public')));
app.use(express.static(path.resolve('dist')));
// app.use(express.static(path.join('dist')));
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46


/**
 * Definir as rotas da API REST
 */
app.use('/api/tasks', require('./server/routes/task-router'));
app.use('/api/users', require('./server/routes/user-router'));

/**
<<<<<<< HEAD
 * Pega todas as outras rotas que não são da API e devolve arquivo index.html
=======
 * Pegua todas as outras rotas que não são da API e devolve arquivo index.html
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
 * O Angular irá tratar essas rotas
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

/**
 * Obter a porta do ambiente e armazenar no Express.
 */
<<<<<<< HEAD
const port = process.env.PORT || '8080';
app.set('port', port);

=======
const port = process.env.PORT || '3000';
app.set('port', port);

/**
 * Criar HTTP server.
 */
const server = http.createServer(app);
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

/**
 * Listen on provided port, on all network interfaces.
 */
<<<<<<< HEAD
app.listen(app.get('port'), function() {
    console.log("App running on port", app.get('port'));
});
=======
server.listen(port, () => console.log(`API running on localhost:${port}`));
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46



