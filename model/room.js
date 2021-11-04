const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    topic :{
        type : String,
        required : true,
    },
    roomType :{
        type : String,
        required : true
    },
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    speaker : {
        type : [
            {
                type : mongoose.Schema.Types.ObjectId,
                ref : "User"
            }
        ],
        required : false
    }
    
},
{
    timestamps : true
})