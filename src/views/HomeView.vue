<script setup>
import TheWelcome from '../components/TheWelcome.vue'
import { reactive } from 'vue'
import { ref } from 'vue';
import { io } from "socket.io-client";
const socket = io("http://localhost:3002");

const state = reactive ({
  message: null
})
function send () {
  socket.emit("message", state.message);
  console.log(state.message);
  state.message = ''
}
</script>

<template>
<div class="chat">
   <input type="text" v-model="state.message">
  <button class="btn" @click="send">ok</button>
</div>
</template>
