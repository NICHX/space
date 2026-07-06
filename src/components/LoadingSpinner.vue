<script setup lang="ts">
</script>

<template>
  <div class="loading-overlay">
    <div class="loading-dot" />
  </div>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  background: #111;
}
.loading-dot {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.8);
  animation: pulse-scale 1.2s ease-in-out infinite;
}
@keyframes pulse-scale {
  0% { opacity: 1; transform: scale(0); }
  100% { opacity: 0; transform: scale(1); }
}
</style>
