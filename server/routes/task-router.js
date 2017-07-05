'use strict';

const express = require('express');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const PATH_UPLOAD = './server/public/uploads/files';
const upload = require('./../config/upload')({ filename: "file", localstorage: PATH_UPLOAD, filename_ori: true });
const passport = require("./../config/passport")(require('passport'));
const Task = require('./../models/task');

/**
 * Realiza upload do arquivo
 */
router.post('/upload/file', function (req, res) {
    upload.sendSingle(req, res, function (err) {
        if (err) return res.status(400).send(err);

        res.status(200).send({ file: req.file });
    });
});

/**
 * Remove do servidor a imagem do usuário de acordo com o nome da imagem
 */
router.delete('/upload/file/:filename', function (req, res) {
    if (!deleteFile(req.params.filename))
        return res.status(404).end();

    res.status(200).end();
});

/**
 * Lista todas as tarefas da base de dados relacionadas ao usuário,
 * de acordo com o _id recebido do passport.authenticate().
 * Listagem em ordem descrecente com base da data de atualização
 */
router.get('/', passport.authenticate(), function (req, res) {
    Task.find({ user: req.user._id }).sort({ updated_at: -1 }).then(function (tasks) {
        res.status(200).send(tasks);
    }).catch();
});

/**
 * Seleciana uma tarefa de acordo com o id.
 */
router.get('/:id', passport.authenticate(), function (req, res) {
    Task.findOne({ _id: req.params.id, user: req.user._id }).then(function (task) {
        if (task) return res.status(200).send(task);

        res.status(404).end();
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

/**
 * Lista todas as tarefas da base de dados de acordo com os filtros e term (busca) 
 * de acordo com o _id recebido do passport.authenticate().
 * Listagem em ordem descrecente com base da data de atualização.
 * 
 * FILTROS:
 * filter: today, seven, expired, archived, all, alert
 */
router.get('/filter/:filter', passport.authenticate(), function (req, res) {
    let filter = { $or: [{ isFinalized: false }, { isFinalized: null }] };

    if (req.params.filter === 'today') {
        filter.completionDate = moment().format('YYYY-MM-DD');
    } else if (req.params.filter === 'seven') {
        filter.completionDate = { $gte: moment().format('YYYY-MM-DD'), $lte: moment().add(7, 'days').format('YYYY-MM-DD') };
    } else if (req.params.filter === 'expired') {
        filter.completionDate = { $lt: moment().format('YYYY-MM-DD') };
    } else if (req.params.filter === 'archived') {
        filter = {};
        filter.isFinalized = true;
    } else if (req.params.filter === 'alert') {
        filter.noticeDate = { $lte: moment().add(7, 'days').format('YYYY-MM-DD') };
    } else { // all
        filter = {};
    }

    filter.user = req.user._id;
    Task.find(filter).sort({ updated_at: -1 }).then(function (tasks) {
        res.status(200).send(tasks);
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

/**
 * Recupera array com todos os labels cadastrados do usuário.
 */
router.get('/labels/list', passport.authenticate(), function (req, res) {
    Task.find({ user: req.user._id }, 'labels').then(function (tags) {
        let labels = tags.filter(elem => elem.labels.length) // Pega apenas os elementos que tem labels
            .map(elem => elem.labels) // Retorna um array com arrays de labels
            .reduce((prevVal, elem) => prevVal.concat(elem), []) // Transforma array de array em um array
            .filter((elem, index, array) => array.indexOf(elem) === index) // Remove repetidos

        res.status(200).send(labels);
    }).catch();
});

/**
 * Salva uma nova tarefa na base de dados.
 */
router.post('/', passport.authenticate(), function (req, res) {
    req.body.user = req.user._id; // pega o id do usuário

    if (typeof req.body.labels === 'string') {
        // Tratando os labels antes de salvar
        req.body.labels = labelsToArray(req.body.labels);
    }

    // Salva na base de dados
    Task.create(req.body).then(function (task) {
        res.status(201).send(task);
    }).catch(function (err) {
        res.status(400).send(err);
    });
});

/**
 * Atualiza uma tarefa na base de dados de acordo com o id.
 */
router.put('/:id', passport.authenticate(), function (req, res) {
    if (typeof req.body.labels === 'string') {
        // Tratando os labels antes de salvar
        req.body.labels = labelsToArray(req.body.labels);
    }

    Task.findByIdAndUpdate(req.params.id, req.body).then(function () {
        Task.findById(req.params.id).then(function (task) {
            res.status(201).send(task);
        });
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

/**
 * Atualiza tarefa de acordo com o id como finalizada.
 */
router.put('/setdone/:id', passport.authenticate(), function (req, res) {
    Task.update({ _id: req.params.id }, { isFinalized: true }).then(function () {
        res.status(201).send(true);
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

/**
 * Remove uma tarefa da base de dados de acordo com o id.
 * Se houver um file associado o mesmo será excluído do servidor também.
 */
router.delete('/:id', passport.authenticate(), function (req, res) {
    Task.findByIdAndRemove(req.params.id).then(function (task) {
        if (task.file) deleteFile(task.file); // deleta o arquivo do servidor

        res.send(task);
    }).catch(function (err) {
        res.status(404).send(err);
    });
});

/**
 * Recebe uma string com as labels separadas por virgula
 * e retorna um array.
 * 
 * @param {String} labels 
 * @returns {Array}
 */
function labelsToArray(labels) {
    let labels_arr = [];

    if (labels !== 'undefined' && labels.length > 0) {
        labels.split(",").forEach(function (item) {
            labels_arr.push(item.trim());
        });
    }
    return labels_arr;
}

/**
 * Remove arquivo do servidor de acordo com o filename
 * 
 * @param {string} filaname 
 */
function deleteFile(filaname) {
    let _path = path.resolve(PATH_UPLOAD).concat('/', filaname);
    fs.unlink(_path, function (err) {
        if (err) return false;

        return true;
    });
}

module.exports = router;