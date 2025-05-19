const config_database = require('./../config/database')
const db = config_database.db

module.exports =
{

    getAll: function () {
        return new Promise((resolve,reject)=>{
            db.query('SELECT * FROM karyawan', (errorSQL,dataSQL)=>{
                if (errorSQL) {
                    reject(errorSQL)
                } else {
                    resolve(dataSQL)
                }
            })
        })
    },



    getOne: function (id_kry) {
        return new Promise((resolve,reject)=>{
            db.query(
                `SELECT
                    karyawan.*,
                    departemen.nama AS dept_nama, departemen.singkatan,
                    agama.nama AS agama_nama
                FROM karyawan
                LEFT JOIN departemen ON karyawan.departemen_id = departemen.id
                LEFT JOIN agama ON karyawan.agama_id = agama.id
                WHERE karyawan.id = ?`,
                [id_kry],
                (errorSQL,dataSQL)=>{
                if (errorSQL) {
                    reject(errorSQL)
                } else {
                    resolve(dataSQL)
                }
            })
        })
    },



    insert: function (req) {
        return new Promise((resolve,reject)=>{
            db.query(
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
                )`,
                (errorSQL,feedbackSQL)=>{
                    if (errorSQL) {
                        reject(errorSQL)
                    } else {
                        resolve(feedbackSQL)
                    }
                }
            )
        })
    },



    hapus: function(id_kry) {
        return new Promise((resolve,reject)=>{
            db.query(
                `DELETE FROM karyawan WHERE id = ?`,[id_kry],
                (errorSQL,feedbackSQL)=>{
                    if (errorSQL) {
                        reject(errorSQL)
                    } else {
                        resolve(feedbackSQL)
                    }
                }
            )
        })
    },



    update: function(req, id_kry) {
        return new Promise((resolve,reject)=>{
            db.query(
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
                [id_kry],
                (errorSQL,dataSQL)=>{
                if (errorSQL) {
                    reject(errorSQL)
                } else {
                    resolve(dataSQL)
                }
            })
        })
    }


}