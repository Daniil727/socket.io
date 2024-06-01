
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

//запуск сокет сервера
io.on("connection", (socket) => {
  console.log("a user connected", socket);
});

httpServer.listen(3002, async()=>{
  console.log("сокит сервер запущен 3002");
});


//маршруты
app.get("/", function (req, res) {
  res.send('12345678');
});
app.listen(3003, async () => {
  console.log("веб сервер запущен 3003");
});

