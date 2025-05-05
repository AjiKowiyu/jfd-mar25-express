const express   = require('express')
const app       = express()


app.get('/', (req, res)=>{
  res.send('<h1>Hello World</h1><hr><hr><hr>')
})


app.listen(3000, ()=>{
    console.log('Server sudah on, silakan akses http://localhost:3000')
})