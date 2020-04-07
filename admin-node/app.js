const express = require('express')
const router = require('./router')
//文件处理库
const fs = require('fs')
const http = require('http');
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use('/',router)
http.createServer(app).listen(5000,function(){
    console.log("'启动")
})

// const server = app.listen(5000, function(){
//     const { address, port } = server.address()
//     console.log('启动：http://%s:%s', address, port)
// })