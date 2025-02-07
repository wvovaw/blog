<script setup lang="ts">
const code = `
div.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
`;
</script>

<template>
  <div class="center">
    <pre>
      {{ code }}
    </pre>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/assets/styles/themes" as *;

div {
  width: fit-content;
  height: fit-content;
  background: $primary;
}

div.center {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
