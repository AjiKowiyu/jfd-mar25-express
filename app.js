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
        dakar: await dataKaryawan
    }
    res.render('karyawan/detail', dataView)
})



app.get('/karyawan/tambah', (req,res)=>{
    res.render('karyawan/form-tambah')
})



app.post('/karyawan/proses-simpan', async (req,res)=>{
    let insertKaryawan = new Promise((resolve,reject)=>{
        db.query(
            `INSERT INTO karyawan
            (nama, gender, alamat, nip, tanggal_lahir, nomor_telp)
            VALUES
            (
                '${req.body.form_namalengkap}',
                '${req.body.form_gender}',
                '${req.body.form_alamat}',
                '${req.body.form_nip}',
                '${req.body.form_tgl_lahir}',
                '${req.body.form_notelp}'
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
            res.redirect('/karyawan')
        }
    } catch (error) {
        throw error
    }
})



app.listen(3000, ()=>{
    console.log('Server sudah on, silakan akses http://localhost:3000')
})