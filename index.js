const express = require('express')
const app = express()
require('dotenv').config()
const http = require('http')
const server = http.createServer(app)
const authRoute = require('./routes/auth.route')
const roomRoute = require('./routes/room.route')
const mongoose = require('mongoose')
const cors = require('cors')
app.use(cors())
const io = require("socket.io")(server,
    {
        cors : {
            origin : "*"
        }
    })
mongoose.connect(process.env.MONGO_URL,(err,client)=>{
        if(err) return console.error(err);
        console.log("connected to mongoose")
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
        console.log(data)
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
        io.to(socket.id).emit("all users",userInThisRoom);
    })


    socket.on('change role',payload=>{
        // console.log("chage role")
    const roomId = payload.roomId
        // const userId = payload.userId;
        // const index = users[roomId]["users"].findIndex(user=> user.id == userId);
        // console.log("index",index);
        // if(index){
        //         if(!(users[roomId]["users"][index].role == payload.role)){
        //             users[roomId]["users"][index].role = payload.role;
        //             console.log("user room",users[roomId])
        //             const room = users[roomId].users;
        //             io.to(userId).emit('set role',payload.role);
        //             room.forEach(user => {
        //                 console.log("send")
        //                  socket.to(user.socketId).emit("user out",{id : socket.id});
        //                // io.to(user.socketId).emit("user out",room);
        //             });

        //         }
        //     }
        const room = users[roomId].users;
        //io.to(userId).emit('set role',payload.role);
        console.log("user in room role",room)
        room.forEach(user => {
             io.to(user.socketId).emit("role change",{id : payload.userId,role : payload.role});
           // io.to(user.socketId).emit("user out",room);
        });
        });
     
     
    socket.on('sending signal',payload=>{
        console.log("payload",payload)
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
            room.forEach(user => {
                socket.to(user.socketId).emit("user out",{id : socket.id});
                //socket.to(user.socketId).emit("user out",room);
            });
        }
    } 
    })


})


app.use(express.json())
app.get('/',(req,res)=>{
    res.send("Hello world");
})
app.use("/api/auth",authRoute);
app.use("/api/room",roomRoute)
server.listen(process.env.PORT || 9000,()=>{
    console.log('server is running on port')
})
