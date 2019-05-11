const bCrypt = require('bcrypt-nodejs');

function generateHash (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
    };

    module.exports = generateHash;