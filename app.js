const express   = require('express')
const app       = express()
const session   = require('express-session')
const fileUpload= require('express-fileupload')
const {body, query, validationResult} = require('express-validator')


let controller_beranda  = require('./controller/controller_beranda')
let controller_profil   = require('./controller/controller_profil')
let controller_karyawan = require('./controller/controller_karyawan')
let controller_auth     = require('./controller/controller_auth')
let controller_dashboard= require('./controller/controller_dashboard')
let cek_login           = controller_auth.cek_login


// untuk mengambil data yg ter-encoded(enkripsi) dari form html
// yang dikirimkan melalui protokol http
app.use( express.urlencoded({extended:false}) )
app.use( express.static('public') )
app.use( fileUpload() )
app.use( session({
    secret: 'rahasia',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: (1000 * 60) * 30
        // batas session expired:
        // 1000 milidetik * 60 = 1 menit
        // 1 menit * 30 = 1/2 jam
    }
}))

app.set('view engine', 'ejs')   //setting penggunaan template engine untuk express
app.set('views', 'view-ejs')    //setting penggunaan folder untuk menyimpan seluruh file .ejs


app.get('/', controller_beranda.halaman_beranda)
app.get('/profil', controller_profil.halaman_profil)
app.get('/karyawan', cek_login, controller_karyawan.halaman_karyawan_index)
app.get('/karyawan/detail/:id_karyawan', cek_login, controller_karyawan.halaman_karyawan_detail)
app.get('/karyawan/tambah', cek_login, controller_karyawan.halaman_karyawan_form_tambah)

let validasi_insertKaryawanBaru = [
    body('form_namalengkap').notEmpty().isString(),
    body('form_nip').notEmpty().isNumeric(),
]
app.post('/karyawan/proses-simpan', cek_login, validasi_insertKaryawanBaru, controller_karyawan.proses_simpan)
app.get('/karyawan/hapus/:id_karyawan', cek_login, controller_karyawan.hapus)
app.get('/karyawan/edit/:id_karyawan', cek_login, controller_karyawan.halaman_karyawan_form_edit)
app.post('/karyawan/proses-update/:id_karyawan', cek_login, controller_karyawan.proses_update)
app.post('/karyawan/proses-update-foto/:id_karyawan', cek_login, controller_karyawan.proses_update_foto)

app.get('/login', controller_auth.halaman_login)
app.post('/auth/proses-login', controller_auth.proses_login)

app.get('/dashboard', cek_login, controller_dashboard.halaman_utama)

app.listen(3000, ()=>{
    console.log('Server sudah on, silakan akses http://localhost:3000')
})