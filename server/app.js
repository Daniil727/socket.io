
  import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import * as mysql  from "mysql";


const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
  origin: "http://localhost:5173",
},
});


const db = mysql.createConnection({
  host: 'MySQL-8.0',
  user: 'root',
  password: '',
  database: 'chat'
});
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL');
});


const users = {};

app.post('/register', (req, res) => {
  const { username, password } = req.body;
  const user = { username, password };
  users[username] = user;
  res.send(`User ${username} registered successfully`);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username].password === password) {
    res.send(`User ${username} logged in successfully`);
  } else {
    res.status(401).send('Invalid username or password');
  }
});

io.on('connection', (socket) => {
  socket.on('user_message', (data) => {
    const { message, roomId, username } = data;
    // сохранение в бд
    db.query(`INSERT INTO messages (room_id, user_id, message) VALUES (?, ?, ?)`, [roomId, username, message], (err, results) => {
      if (err) {
        console.error('Error saving message to MySQL:', err);
      }
    });
//сообщение в комнату
    io.to(`room${roomId}`).emit('server_message', message);
  });
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
//чат 1на 1
  socket.on("private_message", (data) => {
    const recipientSocket = io.sockets.sockets[data.recipientId];
    if (recipientSocket) {
      recipientSocket.emit("private_message", data.message);
    }
  });
  // получаем список пользователей
  socket.on("get_user_list", () => {
    const users = [];
   
    io.emit("user_list", users);
  });
  
});

httpServer.listen(3002, async()=>{
  console.log("сокит сервер запущен 3002");
});





