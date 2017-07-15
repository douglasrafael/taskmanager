'use strict';

const express = require('express');
const jwt = require("jwt-simple");
<<<<<<< HEAD
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
=======
const fs = require('fs');
const path = require('path');
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

const passport = require("./../config/passport")(require('passport'));
const config = require("./../config/config");
const User = require('./../models/user');

const router = express.Router();

<<<<<<< HEAD
const ctName = 'users';
const upload = require('./../config/upload')({ filename: "avatar", collectionName: ctName });

const conn = mongoose.connection;
const gfs = Grid(conn.db);
=======
const PATH_UPLOAD = './server/public/uploads/users';
const upload = require('./../config/upload')({ filename: "avatar", localstorage: PATH_UPLOAD });
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

/**
 * Realiza upload da imagem do usuário
 */
<<<<<<< HEAD
router.post('/avatar', function (req, res) {
=======
router.post('/upload/avatar', function (req, res, next) {
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
    upload.sendSingle(req, res, function (err) {
        if (err) return res.status(400).send(err);

        res.status(200).send({ file: req.file });
    });
});

/**
<<<<<<< HEAD
 * Seleciona a imagem de acordo com o filename
 */
router.get('/avatar/:filename', passport.authenticate(), function (req, res) {
    gfs.findOne({ filename: req.params.filename, root: ctName }, function (err, file) {
        if (err || !file) return res.status(404).send("File not found!");

        let readStream = gfs.createReadStream({ filename: file.filename, root: ctName });

        readStream.on('data', function (data) {
            res.status(200).send({ file: 'data:'.concat(file.contentType, ';base64,', new Buffer(data).toString('base64')) });
        });
    });
});

/**
 * Remove avatar do usuário de acordo com o filename
 */
router.delete('/avatar/:filename', passport.authenticate(), function (req, res) {
    gfs.exist({ filename: req.params.filename, root: ctName }, function (err, found) {
        if (err) return res.status(404).end();

        if (found) {
            gfs.remove({ filename: req.params.filename, root: ctName }, function (err) {
                if (err) return res.status(404).end();

                res.status(200).end();
            });
        } else {
            res.status(404).send("No image found with that title");
        }
=======
 * Remove do servidor a imagem do usuário de acordo com o nome da imagem
 */
router.delete('/upload/avatar/:filename', function (req, res, next) {
    let fullpath = path.resolve(PATH_UPLOAD).concat('/', req.params.filename);

    fs.unlink(fullpath, function (err) {
        if (err) return res.status(404).send(err);

        return res.status(200).end();
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
    });
});

/**
 * Seleciana um usuário de acordo com o id.
 */
router.get('/', passport.authenticate(), function (req, res) {
<<<<<<< HEAD
    if (!req.user) res.status(404).end();

=======
    if(!req.user) res.status(404).end();
    
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
    res.status(200).send(req.user);
});

/**
 * Salva um novo usuário na base de dados.
 */
router.post('/signup', function (req, res) {
    User.create(req.body).then(function (user) {
        res.status(201).send(user);
    }).catch(function (err) {
        if (err.code === 11000) {
            res.status(400).send({ 'message': 'Já possui um usuário com o mesmo e-mail!' });
        } else {
            res.status(400).send(err);
        }
    });
});

/**
 * Realiza login do usuário no sistema
 */
router.post('/authenticate', function (req, res) {
    User.findOne({ email: req.body.email }).then(function (user) {
        var msg = 'E-mail ou senha inválidos!';
        if (!user) {
            res.status(403).send({ error: msg });
        } else {
            user.comparePassword(req.body.password).then(function (result) {
                if (!result) return res.status(403).send({ error: msg });

                // gera o token
                let userToken = jwt.encode({ '_id': user._id }, config.jwtSecret);
                res.status(200).send({ user: user, token: userToken });
            });
        }
    }).catch(function (err) {
        res.status(500).send(err);
    });
});

/**
 * Remove um usuário da base de dados de acordo com o id.
 */
router.delete('/', passport.authenticate(), function (req, res) {
    User.findByIdAndRemove(req.user._id).then(function (user) {
<<<<<<< HEAD
        if (user.avatar) {
            gfs.remove({ filename: req.params.filename, root: ctName }, function (err) {
                if (err) return res.status(404).send(err);
            });
        }
=======
        if(!user) return res.status(404).send(err);
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46

        res.status(200).send(user);
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

/**
 * Atualiza um usuário na base de dados de acordo com o id.
 * OBS. O password não deve ser atualizado por aqui!!! Pois, não será criptografado.
 */
router.put('/', passport.authenticate(), function (req, res) {
    User.findByIdAndUpdate(req.user._id, req.body, { new: true }).then(function (user) {
        res.status(201).send(user);
    }).catch(function (err) {
        if (err.code === 11000) {
            res.status(400).send({ 'message': 'Já possui um usuário com o mesmo e-mail!', 'codeError': 11000 });
        } else {
            res.status(404).end();
        }
    });
});

/**
 * Atualiza o password do usuário de acordo com o id.
 */
router.put('/password', passport.authenticate(), function (req, res) {
    let user = req.user;
    user.comparePassword(req.body.passwordOld).then(function (result) {
        if (!result) return res.status(403).end(); // senha antiga não coincidem

        user.password = req.body.password;
        user.save().then(function (userUp) {
            res.status(201).send(userUp);
        });
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

module.exports = router;