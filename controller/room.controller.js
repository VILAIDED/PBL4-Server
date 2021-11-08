const Room = require('../model/room')

const createRoom = async (req,res)=>{
    const {topic,roomType,speaker} = req.body

    if(!topic || !roomTYpe){
        return res.status(401).json({
            msg : "All field are required"
        })
    }
    try{
    const room = await Room.crete({
        topic : topic,
        roomType : roomType,
        speakers : speaker,
        ownerId : req.user.user_id
    })
    return res.status(200).json(room);
    }catch(err){
        res.status(500).json({msg : err})
    }
}
const getAllRoom = async (req,res) => {
    const type = req.params.type;
    try{
    const rooms = await RoomModel.find({ status: "open" })
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