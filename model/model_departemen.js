const config_database = require('./../config/database')
const db = config_database.db

module.exports =
{
    getAll: function () {
        return new Promise((resolve,reject)=>{
            db.query(`SELECT * FROM departemen`, (errorSQL,dataSQL)=>{
                if (errorSQL) {
                    reject(errorSQL)
                } else {
                    resolve(dataSQL)
                }
            })
        })
    }
}