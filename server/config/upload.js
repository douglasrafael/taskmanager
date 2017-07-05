const path = require('path');
const multer = require('multer');

/**
 * Recebe os parametros no requere do módulo
 */
module.exports = function (options) {
    const storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, path.resolve(options.localstorage));
        },
        filename: function (req, file, callback) {
            let ext = file.originalname.split('.').pop();
            if (options.filename_ori) {
                let name = file.originalname.replace(/.\w+$/, ""); // nome sem extensão
                return callback(null, name.replace(/[^a-zA-Z0-9]/g,'_').concat('_', Date.now(), '.', ext));
            }
            callback(null, file.fieldname.replace(/[^a-zA-Z0-9]/g,'_').concat('_', Date.now(), '.', ext));
        }
    });

    return {
        sendSingle: multer({ storage: storage }).single(options.filename),
        sendMultiply: multer({ storage: storage }).array(options.filename)
    };
}