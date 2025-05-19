const mysql = require('mysql2')

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



function eksekusi(scriptSQL_dan_parameterData) {
    return new Promise((resolve,reject)=>{
        db.query(scriptSQL_dan_parameterData, (errorSQL,dataSQL)=>{
            if (errorSQL) {
                reject(errorSQL)
            } else {
                resolve(dataSQL)
            }
        })
    })
}


module.exports = {
    db, eksekusi
}
