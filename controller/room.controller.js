const Room = require('../model/room')

const createRoom = async (req,res)=>{
    const {topic,roomType,speaker} = req.body
    if(!topic || !roomType){
        return res.status(401).json({
            msg : "All field are required"
        })
    }
    try{
    const room = new Room({
        topic : topic,
        roomType : roomType,
        status : "On",
        speakers : speaker,
        ownerId : req.body.userId
    })
    const saved = await room.save();
    console.log("hee")
    return res.status(200).json(saved);
    }catch(err){
        res.status(500).json({msg : err})
    }
}
const getAllRoom = async (req,res) => {
    const type = req.params.type;
    try{
    const rooms = await Room.find({ status: "On" })
        // .populate('speakers')
        .populate('ownerId')
        //.populate('speakers')
        .exec()
    console.log('hee')
    return res.status(200).json({room : rooms})
    }catch(err){
        return res.status(500).json({
            msg : err
        })
    }
}
const getRoomByType = async (req,res) => {
    const type = req.params.type;
    try{
    const rooms = await RoomModel.find({ roomType: { $in: type } })
        .populate('speakers')
        .populate('ownerId')
        .exec();
    return res.status(200).json({room : rooms})
    }catch(err){
        return res.status(500).json({
            msg : err
        })
    }
}
module.exports = {
    createRoom,
    getRoomByType,
    getAllRoom
}