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



    insert: function (req) {
        let syntaxSQL = mysql.format(
            `INSERT INTO karyawan
            (nama, gender, alamat, nip, tanggal_lahir, nomor_telp, departemen_id, agama_id)
            VALUES
            (
                '${req.body.form_namalengkap}',
                '${req.body.form_gender}',
                '${req.body.form_alamat}',
                '${req.body.form_nip}',
                '${req.body.form_tgl_lahir}',
                '${req.body.form_notelp}',
                '${req.body.form_departemen}',
                '${req.body.form_agama}'
            )`
        )
        return eksekusi( syntaxSQL ) 
    },



    hapus: function(id_kry) {
        let syntaxSQL = mysql.format(
            `DELETE FROM karyawan WHERE id = ?`,[id_kry]
        )
        return eksekusi( syntaxSQL ) 
    },



    update: function(req, id_kry) {
        let syntaxSQL = mysql.format(
            `UPDATE karyawan SET
                nama            = '${req.body.form_namalengkap}',
                gender          = '${req.body.form_gender}',
                alamat          = '${req.body.form_alamat}',
                nip             = '${req.body.form_nip}',
                tanggal_lahir   = '${req.body.form_tgl_lahir}',
                nomor_telp      = '${req.body.form_notelp}',
                departemen_id   = '${req.body.form_departemen}',
                agama_id        = '${req.body.form_agama}'
            WHERE karyawan.id = ?`,
            [id_kry]
        )
        return eksekusi( syntaxSQL )
    }


}