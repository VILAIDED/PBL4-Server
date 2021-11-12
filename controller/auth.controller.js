const User = require("../model/user")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const register = async (req,res)=>{
    try{
        const userValid  = await User.findOne({ "email" : req.body.email})
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
    }catch(err){
        return res.status(501).json({
            msg : err
        })
    }
    return next()
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

module.exports = {
    verifyToken,
    register,
    signin,
    logined
}