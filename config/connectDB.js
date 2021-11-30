require('dotenv').config()
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL,(err,client)=>{
    if(err) return console.error(err);
    console.log("connected to mongoose")
})