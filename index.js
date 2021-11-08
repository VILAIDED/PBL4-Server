const express = require('express')
const app = express()
require('dotenv').config()
const http = require('http')
const server = http.createServer(app)
const authRoute = require('./routes/auth.route')
const roomRoute = require('./routes/room.route')
const mongoose = require('mongoose')
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
    socket.on('create room',roomId=>{
        const room = {
            admin : socket.id,
            users : [socket.id],
            speaker : [],
            say : []
        }
        users[roomId] = room
       
    })
    socket.on('get room',()=>{
        const allRoom = users
        io.to(socket.id).emit("get room",allRoom)
    })
    socket.on('join room',roomId=>{
        if(user[roomId]){
            users[roomId]["users"].push(socket.id);
        }else{
            const room = {
                admin : socket.id,
                users : [socket.id],
                speaker : [],
                say : []
            }
            users[roomId] = room;
            io.to(socket.id).emit("set role","admin"); 
        }
        socketToRoom[socket.id] = roomId
        const userInThisRoom = { admin : users[roomId].admin,
            users : users[roomId].users.filter(id=>id !== socket.id)}

        io.to(socket.id).emit("all users",userInThisRoom);

        

    })

    socket.on('change role',payload=>{
        const roomId = payload.roomId
        if(payload.role == 'speaker'){
           const userId = payload.userId;
           if(!users[roomId].speaker.includes(userId)){
               console.log("role change")
               users[roomId].speaker.push(userId);
               io.to(userId).emit('set role','speaker');
               console.log(users[roomId])
           } 
        }else if (payload.role == 'say'){
            const userId = payload.userId;
            if(!users[roomId].say.includes(userId)){
               users[roomId].say.push(userId);
               io.to(userId).emit('set role','say');
            }
        }
        
    })
    socket.on('sending signal',payload=>{
        io.to(payload.userToSignal).emit('user joined',{signal : payload.signal,callerID: payload.callerID})
    })
    
    socket.on('returning signal',payload =>{
        io.to(payload.callerID).emit('receiving returned signal',{signal : payload.signal,id : socket.id})
    })
    socket.on('disconnect', ()=>{
       
        const roomId = socketToRoom[socket.id]
        if(users[roomId]){
        let room = users[roomId].users
        if(room){
            room = room.filter(id => id !== socket.id)
            users[roomId].users = room;
            room.forEach(userId => {
                socket.to(userId).emit("user out",{id : socket.id});
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
