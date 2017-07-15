const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const conn = mongoose.connection;
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');

Grid.mongo = mongoose.mongo;

module.exports = function (options) {
    const storage = GridFsStorage({
        gfs: Grid(conn.db),
        filename: function (req, file, callback) {
            let ext = file.originalname.split('.').pop();
            if (options.filename_ori) {
                let name = file.originalname.replace(/.\w+$/, ""); // nome sem extensão
                return callback(null, name.replace(/[^a-zA-Z0-9]/g, '_').concat('_', Date.now(), '.', ext));
            }
            callback(null, file.fieldname.replace(/[^a-zA-Z0-9]/g, '_').concat('_', Date.now(), '.', ext));
        },
        /** With gridfs we can store aditional meta-data along with the file */
        metadata: function (req, file, cb) {
            cb(null, { originalname: file.originalname });
        },
        root: options.collectionName // Nome da collection
    });

    return {
        sendSingle: multer({ storage: storage }).single(options.filename),
        sendMultiply: multer({ storage: storage }).array(options.filename)
    };
}