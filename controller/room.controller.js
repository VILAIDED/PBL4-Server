const Room = require('../model/room')

const createRoom = async (req,res)=>{
    const {topic,roomType,speakers,description} = req.body
    if(!topic || !roomType){
        return res.status(401).json({
            msg : "All field are required"
        })
    }
    try{
    console.log("speaker",speakers)
    const room = new Room({
        description : description,
        topic : topic,
        roomType : roomType,
        status : "On",
        speakers : speakers,
        ownerId : req.body.userId
    })
    const saved = await room.save();
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
       // if(!room.users.includes(userId)) return res.status(500).json({msg : "user not available in room"})
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
const closeRoom = async (req,res) =>{
    const roomId = req.params.roomId;
    try{
        const room = await Room.findOne({_id : roomId});
        if(!room) return res.status(500).json({msg : "room is not exist"});
        room.status = "off";
        const roomUpdated = await room.save();
        return res.status(200).json({room : roomUpdated}); 
    }catch(err){r
        return res.status(500).json({msg : err})
    }
}
const deleteRoom = async (req,res) =>{
    const roomId  = req.params.roomId;
    try{
        await Room.deleteOne({_id : roomId});
        return res.status(200).json({
            msg : "delete successful"
        })
    }catch(err){
        return res.status(500).json({
            msg : err
        })
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
    return res.status(200).json({room : rooms})
    }catch(err){
        return res.status(500).json({
            msg : err
        })
    }
}
const getRoomById = async (req,res) => {
    console.log("get room")
    const roomId = req.params.roomId;
    console.log(roomId)
    try{
    const rooms = await Room.findOne({ _id : roomId})
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
const getRoomList = async (req,res)=>{
    const Ids = req.body.id;
    console.log(req.body)
    console.log(Ids)
    try{
        const rooms = await Room.find({
            '_id' : {$in: 
                Ids
            }
        }).populate('speakers')
        .populate('ownerId')
        .exec();
        return res.status(200).json(rooms)
    }catch(err){
        return res.status(500).json({msg : err})
    }
}
const getRoomByType = async (req,res) => {
    const type = req.params.type;
    try{
    const rooms = await Room.find({ roomType: { $in: type } })
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
    addUserToRoom,
    getRoomById,
    closeRoom,
    deleteRoom,
    getRoomList
}