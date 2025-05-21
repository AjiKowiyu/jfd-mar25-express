const model_user = require("../model/model_user")

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

        if (username_exist.length > 0) {
            res.send('username ada di db')
        } else {
            let pesan = 'Username tidak terdaftar, silakan hubungi HRD !!'
            res.redirect(`/login?msg=${pesan}`)
        }
    },

}