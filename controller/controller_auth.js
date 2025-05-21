const bcrypt        = require('bcryptjs')
const model_user    = require("../model/model_user")

module.exports =
{

    halaman_login: (req,res)=>{
        let dataView = {
            notif: req.query.msg
        }
        res.render('auth/login', dataView)
    },



    proses_login: async(req,res)=>{
        // ambil inputan dari user
        let form_username = req.body.form_username
        let form_password = req.body.form_password

        // cek username yg diinput ada gak di database
        let username_exist = await model_user.cari_username(form_username)

        // jika username ada di db
        if (username_exist.length > 0) {
            // cek password yang diinput cocok gak ?
            let password_cocok = bcrypt.compareSync(form_password, username_exist[0].password)
            if (password_cocok) {
                // izinkan masuk ke halaman utama sistem
                res.redirect('/dashboard')
            } else {
                // kembalikan ke halaman login
                let pesan = 'Password salah !!'
                res.redirect(`/login?msg=${pesan}`)
            }
        }
        // jika username gak ada di db
        else {
            // kembalikan ke halaman login dengan notifikasi
            let pesan = 'Username tidak terdaftar, silakan hubungi HRD !!'
            res.redirect(`/login?msg=${pesan}`)
        }
    },

}