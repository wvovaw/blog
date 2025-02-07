<script setup lang="ts">
import AbsoluteTransform from "./components/absolute-transform.vue";
</script>

<template>
  <div class="app">
    <div class="container">
      <AbsoluteTransform />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/themes" as *;
@use "@/shared/assets/styles/abstracts" as *;

.app {
  width: 100%;
  height: 500px;
  border: 1px solid $cyan;
  border-radius: 10px;
  background-color: alpha($primary, 0.2);
  padding: 1em;
}

.example {
  width: 100px;
  height: 100px;
  background-color: $primary;
}

div.center {
  text-align: center;
  align-items: center;
  align-self: center;
  justify-content: center;
  justify-self: center;
  justify-items: center;
  justify-tracks: center;
  text-justify: center;
  place-items: center;
  place-self: center;
  vertical-align: middle;
  margin: auto;
  position: absolute;
  left: 50%;
  right: 50%;
  transform: translate(-50%, -50%);
}
</style>
