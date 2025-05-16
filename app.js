const express   = require('express')
const app       = express()
const mysql     = require('mysql2')
const moment    = require('moment')
const {body, query, validationResult} = require('express-validator')
moment.locale('id')


// koneksi ke mysql
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'jfd_maret_2025',
})


// koneksi
db.connect( function(){
    console.log('Berhasil terhubung ke mysql\n=================');
})


// untuk menangkap error terkait koneksi dengan mysql
db.addListener('error', function(err) {
    console.log(err)
})


let dataDepartemen = new Promise((resolve,reject)=>{
    db.query(`SELECT * FROM departemen`, (errorSQL,dataSQL)=>{
        if (errorSQL) {
            reject(errorSQL)
        } else {
            resolve(dataSQL)
        }
    })
})

let dataAgama = new Promise((resolve,reject)=>{
    db.query(`SELECT * FROM agama`, (errorSQL,dataSQL)=>{
        if (errorSQL) {
            reject(errorSQL)
        } else {
            resolve(dataSQL)
        }
    })
})



// untuk mengambil data yg ter-encoded(enkripsi) dari form html
// yang dikirimkan melalui protokol http
app.use( express.urlencoded({extended:false}) )
app.set('view engine', 'ejs')   //setting penggunaan template engine untuk express
app.set('views', 'view-ejs')    //setting penggunaan folder untuk menyimpan seluruh file .ejs


app.get('/', (req, res)=>{
    res.render('beranda')
})


app.get('/profil', (req,res)=>{
    let dataView = {
        nama_coach: 'Aji Kowiyu',
        profesi: 'Programmer',
        pengalaman: ['Senior Developer', 'Web Programmer', 'Automation Programmer']
    }
    res.render('halaman-profil', dataView)
})


app.get('/karyawan', async (req,res)=>{
    let dataKaryawan = new Promise((resolve,reject)=>{
        db.query('SELECT * FROM karyawan', (errorSQL,dataSQL)=>{
            if (errorSQL) {
                reject(errorSQL)
            } else {
                resolve(dataSQL)
            }
        })
    })

    let dataDepartemen = new Promise((resolve,reject)=>{
        db.query('SELECT * FROM departemen', (errorSQL,dataSQL)=>{
            if (errorSQL) {
                reject(errorSQL)
            } else {
                resolve(dataSQL)
            }
        })
    })

    let dataView = {
        dakar: await dataKaryawan,
        dadep: await dataDepartemen,
    }
    res.render('karyawan/index', dataView)
})


app.get('/karyawan/detail/:id_karyawan', async (req,res)=>{
    let id_kry = req.params.id_karyawan
    let dataKaryawan = new Promise((resolve,reject)=>{
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

    let dataView = {
        dakar: await dataKaryawan,
        moment: moment,
    }
    res.render('karyawan/detail', dataView)
})



app.get('/karyawan/tambah', async (req,res)=>{
    let dataView = {
        dept: await dataDepartemen,
        agama: await dataAgama,
    }

    res.render('karyawan/form-tambah', dataView)
})



let validasi_insertKaryawanBaru = [
    body('form_namalengkap').notEmpty().isString(),
    body('form_nip').notEmpty().isNumeric(),
]



app.post('/karyawan/proses-simpan', validasi_insertKaryawanBaru, async (req,res)=>{
    let isiForm = {
        namalengkap : req.body.form_namalengkap,
        gender      : req.body.form_gender,
        alamat      : req.body.form_alamat,
        nip         : req.body.form_nip,
        tgl_lahir   : req.body.form_tgl_lahir,
        notel       : req.body.form_notel,
    }
    let validationError = validationResult(req)

    // jika lolos validasi
    if (validationError.isEmpty()) {
        let insertKaryawan = new Promise((resolve,reject)=>{
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
        
        try {
            let insertKeDB = await insertKaryawan
            if (insertKeDB.affectedRows > 0) {
                return res.redirect('/karyawan')
            }
        } catch (error) {
            throw error
        }
    }


    // jika validasi gagal
    let errorData = {
        pesanError: validationError.array(),
        ketikanForm: isiForm,
        dept: await dataDepartemen,
        agama: await dataAgama,
    }
    console.log(errorData.pesanError)
    // errorData.pesanError[0].fields
    return res.render('karyawan/form-tambah', errorData)
})



app.get('/karyawan/hapus/:id_karyawan', async(req,res)=>{
    let id_kry      = req.params.id_karyawan
    let hapus_kry   = new Promise((resolve,reject)=>{
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

    try {
        let hapusDiDB = await hapus_kry
        if (hapusDiDB.affectedRows > 0) {
            return res.redirect('/karyawan')
        }
    } catch (error) {
        throw error
    }

})



app.get('/karyawan/edit/:id_karyawan', async(req,res)=>{
    let id_kry = req.params.id_karyawan
    let dataKaryawan = new Promise((resolve,reject)=>{
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

    let dataView = {
        dakar: await dataKaryawan,
        dept: await dataDepartemen,
        agama: await dataAgama,
        moment: moment,
    }
    res.render('karyawan/form-edit', dataView)
})



app.post('/karyawan/proses-update/:id_karyawan', async(req,res)=>{
    let id_kry      = req.params.id_karyawan
    let update_kry  = new Promise((resolve,reject)=>{
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

    try {
        let updateKeDB = await update_kry
        if (updateKeDB.affectedRows > 0) {
            return res.redirect('/karyawan')
        }
    } catch (error) {
        throw error
    }
})



app.listen(3000, ()=>{
    console.log('Server sudah on, silakan akses http://localhost:3000')
})