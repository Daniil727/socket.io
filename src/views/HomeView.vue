<script setup>
import { ref } from 'vue'
import { io } from "socket.io-client";
const socket = io("http://localhost:3002");
const message = ref('');
const messages = ref([]); //стоило-бы хранить сообщения со стороны сервера, но пока что так...

//получаем сообщение с сервера пушим в массив messages
socket.on('connect', () => {
  socket.on('server_message', (value)=>{
    console.log(value)
    messages.value.push(value)
  })
});

//функция получает текст сообщения и отправляет на сервер
function send (){
    socket.emit('user_message', message.value);
    // console.log(message.value)
    message.value = '';
}



</script>

<template>
<div class="home">
  <input type="text" @keyup.enter="send" v-model="message">
  <button class="btn" @click="send">отправить</button>
</div>
  <div v-for="(message, index) in messages" :key="index">
    {{ message }}
  </div>
</template>
