module.exports =
{
    halaman_profil: (req,res)=>{
        let dataView = {
            nama_coach: 'Aji Kowiyu',
            profesi: 'Programmer',
            pengalaman: ['Senior Developer', 'Web Programmer', 'Automation Programmer']
        }
        res.render('halaman-profil', dataView)
    }
}