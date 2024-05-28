import express from 'express';
import { createServer } from "http";
import { connect } from 'http2';



import { Server } from "socket.io";

const app = express()

const httpServer = createServer(app);
const io = new Server(httpServer, { 
    cors: {
    origin: 'http://localhost:5173'
  }});

io.on("connection", (socket) => {
  console.log("подключен", socket)
  socket.emit('connected', {
    messege: "подключился!!!"
  });
socket.on('message', (arg) => {
    console.log(arg); 
  });

  socket.on("disconnect", (reason) => {
    console.log(reason)
  });
});



httpServer.listen(3002);