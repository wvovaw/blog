<script setup lang="ts">
import { onMounted, ref } from "vue";
const props = defineProps<{ messages: string[] }>();

const randomMessage = () =>
  props.messages[Math.floor(Math.random() * props.messages.length)];

const greeting = ref("");
onMounted(() => (greeting.value = randomMessage()));
</script>

<template>
  <h3 class="greeting">{{ greeting }} Thank you for the visit!</h3>
  <button @click="greeting = randomMessage()">New greeting</button>
</template>

<style scoped lang="scss">
.greeting {
  width: 100%;
}

button {
  border: 1px solid var(--primary);
  padding: 1em 1.5em;
  color: var(--primary);

  font: {
    weight: 900;
    size: 0.8em;
  }

  text: {
    transform: uppercase;
  }

  &:hover {
    background-color: var(--primary);
    color: var(--fg-light);
    .dark & {
      color: var(--fg-dark);
    }
  }
}
</style>
