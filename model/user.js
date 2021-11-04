const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username : {
        type : String,
        required : true,
        min : 3,
        max : 20},
    email : {
        type : String,
        required : true,
        max : 60,
        },
    realname : {
        type : String,
        required : true,
        min : 3,
        max : 20},
    avatar : {
        type : String,
        required : false,
        default : ""
    },
    password : {
        type : String,
        required : true,
        max : 60
    }
},
    {
        timestamps : true
    })

module.exports = mongoose.model("User",userSchema);
