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


let model_agama         = require('./model/model_agama')
let model_departemen    = require('./model/model_departemen')
let model_karyawan      = require('./model/model_karyawan')

let controller_beranda  = require('./controller/controller_beranda')
let controller_profil   = require('./controller/controller_profil')
let controller_karyawan = require('./controller/controller_karyawan')


// untuk mengambil data yg ter-encoded(enkripsi) dari form html
// yang dikirimkan melalui protokol http
app.use( express.urlencoded({extended:false}) )
app.set('view engine', 'ejs')   //setting penggunaan template engine untuk express
app.set('views', 'view-ejs')    //setting penggunaan folder untuk menyimpan seluruh file .ejs


app.get('/', controller_beranda.halaman_beranda)
app.get('/profil', controller_profil.halaman_profil)
app.get('/karyawan', controller_karyawan.halaman_karyawan_index)
app.get('/karyawan/detail/:id_karyawan', controller_karyawan.halaman_karyawan_detail)
app.get('/karyawan/tambah', controller_karyawan.halaman_karyawan_form_tambah)

let validasi_insertKaryawanBaru = [
    body('form_namalengkap').notEmpty().isString(),
    body('form_nip').notEmpty().isNumeric(),
]
app.post('/karyawan/proses-simpan', validasi_insertKaryawanBaru, controller_karyawan.proses_simpan)
app.get('/karyawan/hapus/:id_karyawan', controller_karyawan.hapus)
app.get('/karyawan/edit/:id_karyawan', controller_karyawan.halaman_karyawan_form_edit)
app.post('/karyawan/proses-update/:id_karyawan', controller_karyawan.proses_update)


app.listen(3000, ()=>{
    console.log('Server sudah on, silakan akses http://localhost:3000')
})