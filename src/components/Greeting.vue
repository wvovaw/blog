<script setup lang="ts">
import { ref } from "vue";
const props = defineProps<{ messages: string[] }>();

const randomMessage = () =>
  props.messages[Math.floor(Math.random() * props.messages.length)];

const greeting = ref(randomMessage());
</script>

<template>
  <div>
    <h3>{{ greeting }}! Thank you for the visit!</h3>
    <button @click="greeting = randomMessage()">New greeting</button>
  </div>
</template>
