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
    let dataView = {
        dakar: await model_karyawan.getAll(),
        notif: req.query.msg,
    }
    res.render('karyawan/index', dataView)
})


app.get('/karyawan/detail/:id_karyawan', async (req,res)=>{
    let id_kry = req.params.id_karyawan

    let dataView = {
        dakar: await model_karyawan.getOne(id_kry),
        moment: moment,
    }
    res.render('karyawan/detail', dataView)
})



app.get('/karyawan/tambah', async (req,res)=>{
    let dataView = {
        dept: await model_departemen.getAll(),
        agama: await model_agama.getAll(),
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
        try {
            let insertKeDB = await model_karyawan.insert(req)
            if (insertKeDB.affectedRows > 0) {
                return res.redirect('/karyawan?msg=Berhasil membuat karyawan baru')
            }
        } catch (error) {
            throw error
        }
    }


    // jika validasi gagal
    let errorData = {
        pesanError: validationError.array(),
        ketikanForm: isiForm,
        dept: await model_departemen.getAll(),
        agama: await model_agama.getAll(),
    }
    console.log(errorData.pesanError)
    // errorData.pesanError[0].fields
    return res.render('karyawan/form-tambah', errorData)
})



app.get('/karyawan/hapus/:id_karyawan', async(req,res)=>{
    let id_kry = req.params.id_karyawan
    try {
        let hapusDiDB = await model_karyawan.hapus(id_kry)
        if (hapusDiDB.affectedRows > 0) {
            return res.redirect('/karyawan?msg=Berhasil hapus karyawan!')
        }
    } catch (error) {
        throw error
    }

})



app.get('/karyawan/edit/:id_karyawan', async(req,res)=>{
    let id_kry = req.params.id_karyawan
    let dataView = {
        dakar: await model_karyawan.getOne(id_kry),
        dept: await model_departemen.getAll(),
        agama: await model_agama.getAll(),
        moment: moment,
    }
    res.render('karyawan/form-edit', dataView)
})



app.post('/karyawan/proses-update/:id_karyawan', async(req,res)=>{
    let id_kry = req.params.id_karyawan
    try {
        let updateKeDB = await model_karyawan.update(req, id_kry)
        if (updateKeDB.affectedRows > 0) {
            return res.redirect(`/karyawan?msg=Berhasil edit profil karyawan atas nama ${req.body.form_namalengkap}`)
        }
    } catch (error) {
        throw error
    }
})



app.listen(3000, ()=>{
    console.log('Server sudah on, silakan akses http://localhost:3000')
})