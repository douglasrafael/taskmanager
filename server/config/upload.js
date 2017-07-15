const path = require('path');
const multer = require('multer');
<<<<<<< HEAD
const mongoose = require('mongoose');
const conn = mongoose.connection;
const Grid = require('gridfs-stream');
const GridFsStorage = require('multer-gridfs-storage');

Grid.mongo = mongoose.mongo;

module.exports = function (options) {
    const storage = GridFsStorage({
        gfs: Grid(conn.db),
=======

/**
 * Recebe os parametros no requere do módulo
 */
module.exports = function (options) {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.resolve(options.localstorage));
        },
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
        filename: function (req, file, callback) {
            let ext = file.originalname.split('.').pop();
            if (options.filename_ori) {
                let name = file.originalname.replace(/.\w+$/, ""); // nome sem extensão
<<<<<<< HEAD
                return callback(null, name.replace(/[^a-zA-Z0-9]/g, '_').concat('_', Date.now(), '.', ext));
            }
            callback(null, file.fieldname.replace(/[^a-zA-Z0-9]/g, '_').concat('_', Date.now(), '.', ext));
        },
        /** With gridfs we can store aditional meta-data along with the file */
        metadata: function (req, file, cb) {
            cb(null, { originalname: file.originalname });
        },
        root: options.collectionName // Nome da collection
=======
                return callback(null, name.replace(/[^a-zA-Z0-9]/g,'_').concat('_', Date.now(), '.', ext));
            }
            callback(null, file.fieldname.replace(/[^a-zA-Z0-9]/g,'_').concat('_', Date.now(), '.', ext));
        }
>>>>>>> fc42f5941063905486f73b9eb1cbd0ff6d7c6f46
    });

    return {
        sendSingle: multer({ storage: storage }).single(options.filename),
        sendMultiply: multer({ storage: storage }).array(options.filename)
    };
}