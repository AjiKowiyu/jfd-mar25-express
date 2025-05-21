const mysql             = require('mysql2')
const config_database   = require('./../config/database')
const db                = config_database.db
const eksekusi          = config_database.eksekusi



module.exports =
{

    cari_username: function (form_username) {
        let syntaxSQL = mysql.format(
            'SELECT * FROM user WHERE username = ?', [form_username]
        )
        return eksekusi( syntaxSQL )
    },

}