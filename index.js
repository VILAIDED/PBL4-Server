const express = require('express')
const app = express()
require("./config/connectDB")
require('dotenv').config()
const http = require('http')
const imageUpload = require('./middlewares/uploadImage')
const server = http.createServer(app)
const authRoute = require('./routes/auth.route')
const roomRoute = require('./routes/room.route')

const cors = require('cors')
app.use(cors())
const io = require("socket.io")(server,
    {
        cors : {
            origin : "*"
        }
    })

const users = {}
const socketToRoom = {}

io.on('connection',socket=>{
    socket.on('create room',data=>{
        const room = {
        users : [{ socketId : socket.id
                 ,id : data.user.userId,
                  avatar : data.user.avatar,
                  username : data.user.username,
                  role : "admin"}]
        }
        users[data.roomId] = room
       
    })
    socket.on('get room',()=>{
        const allRoom = users
        io.to(socket.id).emit("get room",allRoom)
    })
    socket.on('join room',data=>{
        console.log("new user",data)
        if(users[data.roomId]){
            users[data.roomId]["users"].push({ socketId : socket.id
                ,id : data.user.userId,
                 avatar : data.user.avatar,
                 username : data.user.username,
                 role : "user"});
        }else{
            const room = {
                users : [{ socketId : socket.id
                    ,id : data.user.userId,
                     avatar : data.user.avatar,
                     username : data.user.username,
                     role : "admin"}]
                }
            users[data.roomId] = room;
        }
        socketToRoom[socket.id] = data.roomId
        const room = users[data.roomId];
        const userInThisRoom = {    
            users : room.users}
        console.log("user in room",userInThisRoom)
        io.to(socket.id).emit("all users",userInThisRoom);
    })


    socket.on('change role',payload=>{
    const roomId = payload.roomId
        const room = users[roomId].users;
        console.log("user in room role",room)
        room.forEach(user => {
             io.to(user.socketId).emit("role change",{id : payload.userId,role : payload.role});
        });
        });
     
     
    socket.on('sending signal',payload=>{
        const caller = users[payload.roomId]["users"].find(user=> user.socketId == payload.callerId)
        io.to(payload.userToSignal).emit('user joined',{signal : payload.signal,caller : caller})
    })
    
    socket.on('returning signal',payload =>{
        io.to(payload.callerId).emit('receiving returned signal',{signal : payload.signal,id : socket.id})
    })
    socket.on('disconnect', ()=>{
       
        const roomId = socketToRoom[socket.id]
        if(users[roomId]){
        let room = users[roomId].users
        if(room){
            room = room.filter(user => user.socketId !== socket.id)
            users[roomId].users = room;
            console.log("user available",users)
            room.forEach(user => {
                socket.to(user.socketId).emit("user out",{id : socket.id});
                //socket.to(user.socketId).emit("user out",room);
            });
        }
    } 
    })
    socket.on('user out', ()=>{
       
        const roomId = socketToRoom[socket.id]
        if(users[roomId]){
        let room = users[roomId].users
        if(room){
            room = room.filter(user => user.socketId !== socket.id)
            users[roomId].users = room;
            console.log("user available",users)
            room.forEach(user => {
                socket.to(user.socketId).emit("user out",{id : socket.id});
                //socket.to(user.socketId).emit("user out",room);
            });
        }
    } 
    })


})


app.use(express.json())
app.use(express.static(__dirname+ "/public"));


app.post('/',imageUpload.single('image'),(req,res)=>{
    console.log("wu wu")
    res.send(req.file.filename)
})
app.get('/',(req,res)=>{
    res.send("Hello world");
})
app.use("/api/auth",authRoute);
app.use("/api/room",roomRoute)
server.listen(process.env.PORT || 9000,()=>{
    console.log('server is running on port')
})
