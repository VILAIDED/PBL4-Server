const express = require('express')
const app = express()
require('dotenv').config()
const http = require('http')
const server = http.createServer(app)
const authRoute = require('./routes/auth')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URL,(err,client)=>{
    if(err) return console.error(err);
    console.log("connected to mongoose")
})

app.use(express.json())
app.get('/',(req,res)=>{
    res.send("Hello world");
})
app.use("/api/auth",authRoute);
server.listen(process.env.PORT || 9000,()=>{
    console.log('server is running on port')
})