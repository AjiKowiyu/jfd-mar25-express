const express   = require('express')
const app       = express()
const mysql     = require('mysql2')


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
        dakar: await dataKaryawan
    }
    res.render('karyawan/detail', dataView)
})


app.listen(3000, ()=>{
    console.log('Server sudah on, silakan akses http://localhost:3000')
})