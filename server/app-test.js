'use strict';

const app = require('./config/app-config');

// inicializando as rotas
app.use('/api', require('./routes/user-router'));

module.exports = app;