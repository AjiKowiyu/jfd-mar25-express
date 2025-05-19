const mysql             = require('mysql2')
const config_database   = require('./../config/database')
const db                = config_database.db
const eksekusi          = config_database.eksekusi



module.exports =
{

    getAll: function () {
        let syntaxSQL = mysql.format(
            'SELECT * FROM karyawan'
        )
        return eksekusi( syntaxSQL )
    },



    getOne: function (id_kry) {
        let syntaxSQL = mysql.format(
            `SELECT
                karyawan.*,
                departemen.nama AS dept_nama, departemen.singkatan,
                agama.nama AS agama_nama
            FROM karyawan
            LEFT JOIN departemen ON karyawan.departemen_id = departemen.id
            LEFT JOIN agama ON karyawan.agama_id = agama.id
            WHERE karyawan.id = ?`,
            [id_kry]
        )
        return eksekusi( syntaxSQL )
    },



    insert: function (dataSQL) {
        let syntaxSQL = mysql.format(
            `INSERT INTO karyawan SET ?`, [dataSQL]
        )
        return eksekusi( syntaxSQL ) 
    },



    hapus: function(id_kry) {
        let syntaxSQL = mysql.format(
            `DELETE FROM karyawan WHERE id = ?`,[id_kry]
        )
        return eksekusi( syntaxSQL ) 
    },



    update: function(dataSQL, id_kry) {
        let syntaxSQL = mysql.format(
            `UPDATE karyawan SET ? WHERE karyawan.id = ?`,
            [dataSQL, id_kry]
        )
        return eksekusi( syntaxSQL )
    }


}