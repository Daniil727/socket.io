<script setup>
import { ref } from 'vue'
import { connect, io } from "socket.io-client";
const socket = io("http://localhost:3002");
const message = ref('');
const roomId = ref(null);
const messages = ref([]); //стоило-бы хранить сообщения со стороны сервера, но пока что так...
const privateMessage = ref('');
const recipientId = ref(null);

//получаем сообщение с сервера пушим в массив messages
socket.on('connect', () => {
  socket.on('server_message', (data) => {
    console.log(data)
    messages.value.push(data)
  })
});

//функция получает текст сообщения и отправляет на сервер
function send() {
  socket.emit('user_message', {
    message: message.value, 
    roomId: roomId.value
  })
  message.value = '';
}

// Send private message
function sendPrivateMessage() {
  socket.emit('private_message', {
    message: privateMessage.value,
    recipientId: recipientId.value,
  });
  privateMessage.value = '';
}

// получаем личное сообщение
socket.on('private_message', (message) => {
  console.log(`Received private message: ${message}`);
  messages.value.push(message);
});




</script>

<template>
  <div class="home">
    <!-- ... -->
    <input type="text" v-model="privateMessage" placeholder="Private message">
    <button class="btn" @click="sendPrivateMessage">Send private message</button>
    <div v-for="(message, index) in messages" :key="index">
      {{ message }}
    </div>
  </div>
</template>

<!-- <template>
  <div class="home">
    <input type="number" v-model="roomId" placeholder="комната">
    <input type="text" @keyup.enter="send" v-model="message">
    <button class="btn" @click="send">отправить</button>
  </div>
  <div v-for="(message, index) in messages" :key="index">
    {{ message }}
  </div>
</template> -->
