const mongoose = require('mongoose')

const roomSchema = new mongoose.Schema({
    topic :{
        type : String,
        required : true,
    },
    description : {
        type : String,
        required : false
    },
    roomType :{
        type : String,
        required : true
    },
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    status:{
        type : String,
        default : "open"
    },
    users : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
        ]
    },
    speakers : {
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
module.exports = mongoose.model("Room",roomSchema)