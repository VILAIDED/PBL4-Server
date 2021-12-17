const User = require("../model/user")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const register = async (req,res)=>{
    try{
        const userValid  = await User.findOne({ "username" : req.body.username})
        if(userValid) return res.status("401").json({
            msg : "email is already exist"
        })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword,
            realname : req.body.realname
        });
        const user = await newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({
            msg : err
        })
    }
}

const signin = async (req,res) =>{
    try{
        const user = await User.findOne({
            "username" : req.body.username
        })
        if(!user) return res.status(401).json({
            err : "user not found"
        })
        if(!(await bcrypt.compare(req.body.password,user.password))) return res.status(401).json({
            msg : "username or password is not valid"
        })
        const token = await jwt.sign({
            user : user,   
            }, process.env.TOKEN_SECRET)

        //req.header('auth-token',token);
        res.status(200).json(token);
    }catch(err){
        return res.status(501).json(err)
    }
}

const verifyToken = (req,res,next)=>{
    const token = req.header('auth-token')
   
    if(!token){
        return res.status(403).json({
            msg : "token is not exist"
        })
    }
    try{
        const decode  = jwt.verify(token,process.env.TOKEN_SECRET)
       
        req.body.userId = decode.user._id
        console.log("decode",req.body.userId)
    }catch(err){
        return res.status(501).json({
            msg : err
        })
    }
    return next()
}
const editProfile = async(req,res)=>{
    const id = req.body.userId
    const {username} = req.body;
    try{
        const user = await User.findOne({_id : id});
        if(!user) return res.status(500).json({msg : "user not exist"})
        user.username = username;
        const userUpdated = await user.save();
        return res.status(200).json({
            user : userUpdated
        })
    }catch(err){

    }
}
const logined = async(req,res)=>{
    try{
        const userId = req.body.userId
        const user = await User.findOne({
            _id : userId
        })
        user.password = undefined
       
        return res.status(200).json(user)
    }catch(err){
        res.status(500).json({
            msg : err
        })
    }
}
const userChangePassword = async (req,res)=>{
    const userId = req.body.userId;
    try{
        const  user = await User.findOne({
            _id : userId
        })
        if(!(await bcrypt.compare(req.body.password,user.password))) return res.status(401).json({
            msg : "password is not corret"
        })
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.newPassword,salt);
        user.password = hashedPassword;
        const userUpdated  =await user.save();
        return res.status(200).json({userUpdated})


    }catch(err){
        return res.status(500).json({
            err : err
        })
    }
}
const uploadImageProfile = async (req,res)=>{
    const userId = req.body.userId;
    console.log(userId)
    try{
    const user = await User.findOne({
        _id : userId
    })
   
    user.avatar = req.file.filename;
    
    const userUpdated = await user.save();
    return res.status(200).json({userUpdated})
    }catch(err){
        return res.status(500).json({
            err : err
        })
    }
}
const getUserById = async (req,res)=>{
    const userId = req.params.id;
    try{
        const  user = await User.findOne({
            _id : userId
        })
        user.password = undefined;
        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json({msg : err})
    }

}
const getAllUser = async (req,res)=>{
    try{
        const user = await User.find().select("-password");
        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json({msg : err});
    }
}
module.exports = {
    verifyToken,
    register,
    signin,
    logined,
    editProfile,
    uploadImageProfile,
    userChangePassword,
    getUserById,
    getAllUser
}