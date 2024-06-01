
  import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";



const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
  origin: "http://localhost:5173",
},
});
//маршруты
app.get("/", function (req, res) {
  res.send('12345678');
});
app.listen(3003, async () => {
  console.log("веб сервер запущен 3003");
});
//запуск сокет сервера

io.on("connection", (socket) => {
  socket.emit("connected", {
    message: "успешное подключение",
  });
  //получаем сообщение от клиента и перенаправляем обратно на сторону клиента 
  socket.on('user_message', (data)=>{
    socket.leave('room' + data.roomId)
    socket.join('room' + data.roomId)
      io.to('room' + data.roomId).emit('server_message', data.message)
  })
});

httpServer.listen(3002, async()=>{
  console.log("сокит сервер запущен 3002");
});





