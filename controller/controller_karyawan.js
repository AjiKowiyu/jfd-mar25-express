const moment = require('moment')
const {body, query, validationResult} = require('express-validator')
moment.locale('id')

let model_agama         = require('./../model/model_agama')
let model_departemen    = require('./../model/model_departemen')
let model_karyawan      = require('./../model/model_karyawan')

module.exports =
{
    halaman_karyawan_index: async (req,res)=>{
        let dataView = {
            dakar: await model_karyawan.getAll(),
            notif: req.query.msg,
        }
        res.render('karyawan/index', dataView)
    },



    halaman_karyawan_detail: async (req,res)=>{
        let id_kry = req.params.id_karyawan
    
        let dataView = {
            dakar: await model_karyawan.getOne(id_kry),
            moment: moment,
        }
        res.render('karyawan/detail', dataView)
    },



    halaman_karyawan_form_tambah: async (req,res)=>{
        let dataView = {
            dept: await model_departemen.getAll(),
            agama: await model_agama.getAll(),
        }
    
        res.render('karyawan/form-tambah', dataView)
    },



    proses_simpan: async (req,res)=>{
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
                let dataSQL = {
                    nama            : req.body.form_namalengkap,
                    gender          : req.body.form_gender,
                    alamat          : req.body.form_alamat,
                    nip             : 'tb-' + req.body.form_nip,
                    tanggal_lahir   : req.body.form_tgl_lahir,
                    nomor_telp      : req.body.form_notelp,
                    departemen_id   : req.body.form_departemen,
                    agama_id        : req.body.form_agama
                }
                let insertKeDB = await model_karyawan.insert(dataSQL)
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
    },



    hapus: async(req,res)=>{
        let id_kry = req.params.id_karyawan
        try {
            let hapusDiDB = await model_karyawan.hapus(id_kry)
            if (hapusDiDB.affectedRows > 0) {
                return res.redirect('/karyawan?msg=Berhasil hapus karyawan!')
            }
        } catch (error) {
            throw error
        }
    },



    halaman_karyawan_form_edit: async(req,res)=>{
        let id_kry = req.params.id_karyawan
        let dataView = {
            dakar: await model_karyawan.getOne(id_kry),
            dept: await model_departemen.getAll(),
            agama: await model_agama.getAll(),
            moment: moment,
        }
        res.render('karyawan/form-edit', dataView)
    },



    proses_update: async(req,res)=>{
        let id_kry = req.params.id_karyawan
        let dataSQL = {
            alamat          : req.body.form_alamat,
            tanggal_lahir   : req.body.form_tgl_lahir,
            nomor_telp      : req.body.form_notelp,
            departemen_id   : req.body.form_departemen,
            agama_id        : req.body.form_agama
        }

        try {
            let updateKeDB = await model_karyawan.update(dataSQL, id_kry)
            if (updateKeDB.affectedRows > 0) {
                return res.redirect(`/karyawan?msg=Berhasil edit profil karyawan atas nama ${req.body.form_namalengkap}`)
            }
        } catch (error) {
            throw error
        }
    }
}