const express = require('express')
const {chats} = require('./data/data')
const dotenv = require('dotenv')
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, './config/.env') });
console.log("MONGO_URI:", process.env.MONGO_URI); // It should print the MongoDB URI

const port = process.env.PORT || 9000
const connectDB = require('./config/db.js') 
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
connectDB()
const app = express()


app.use(express.json()); // to accept json data from frontend
app.get('/', (req, res) => {
    res.send('Hello to Iqra chat app!')
})


// routes
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

// app.use(express.json())
const server= app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);

})
const io= require('socket.io')(server, {
    pingTimeOut: 60000, //when a server or client doesn't respond to a ping message within a set time,it Checks if the server or client is alive, and reconnect if needed in order to save th bandwidth
    cors: {
        origin: "http://localhost:3000"
    }
});
io.on('connection', (socket)=>{
    console.log('connected to socket.io')
    // creating a new socket where frontedn will send data to join a room
    socket.on('setup',(userData)=>{ //to take user data from frontend
        // creating a new room(for a particular user) with id of the user data
        socket.join(userData._id)
        console.log(userData._id)
        socket.emit('joined')
    }) 
    socket.on('join chat',(room)=>{ //to take room id from frontend
        socket.join(room) // creating room with room id
        console.log('user joined room: ' + room)
    }) 
    socket.on('typing',(room)=>{
       socket.in(room).emit('typing')
    })
    socket.on('stop typing',(room)=>{
        socket.in(room).emit('stop typing')
     })
     socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
    
        if (!chat.users) return console.log("chat.users not defined");
    
        chat.users.forEach((user) => {
          if (user._id == newMessageRecieved.sender._id) return;
    
          socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
      });
    socket.off('setup',()=>{
        console.log('user left')
        socket.leave(userData._id)
    })
})


