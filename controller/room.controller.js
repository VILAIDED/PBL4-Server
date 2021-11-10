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
const setSpeaker = async (req,res)=>{
    const roomId = req.params.roomId;
    const userId = req.body.userId;
    try{
        const room = await Room.findOne({ _id : roomId})
        if(!room) return res.status(500).json({msg : "room is not exitst"})
        if(!room.users.includes(userId)) return res.status(500).json({msg : "user not available in room"})
        if(room.speakers.includes(userId)) return res.status(500).json({msg : "user already a speaker"})
        room.speakers.push(userId);
        const updated = await room.save();
        return res.status(200).json(updated);
    }catch(err){

    }
}
const addUserToRoom = async (req,res)=>{
    const roomId = req.params.roomId;
    const userId = req.body.userId;
    try{
    const room = await Room.findOne({ _id : roomId});
    if(room.users.includes(userId)) return res.status(500).json({msg : "user already exist"})
    room.users.push(userId);
    const updated = await room.save();
    // const roomUpdate = await Room.update({
    //     _id : roomId,
    //     $push : {users : userId}
    // })
    return res.status(200).json(updated);
    }catch(err){
        return res.status(500).json({msg : err})
    }



}
const getAllRoom = async (req,res) => {
    const type = req.params.type;
    try{
    const rooms = await Room.find({ status: "On" })
        // .populate('speakers')
        .populate('ownerId')
        .populate('speakers')
        .populate('users')
        .exec()
    console.log("room",rooms)
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
        .populate('users')
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
    getAllRoom,
    setSpeaker,
    addUserToRoom
}