<script setup lang="ts">
import { useClock } from '@/composables/useClock'

const { time, date } = useClock()
</script>

<template>
  <div class="clock">
    <div class="clock-time">{{ time }}</div>
    <div class="clock-date">{{ date }}</div>
  </div>
</template>

<style scoped>
.clock {
  text-align: left;
  color: var(--text-primary);
  user-select: none;
  line-height: 1.2;
}
.clock-time {
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 2px;
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}
.clock-date {
  font-size: 13px;
  font-weight: 300;
  opacity: 0.7;
  text-shadow: 0 1px 6px rgba(0,0,0,0.3);
  margin-top: 1px;
}
@media (max-width: 576px) {
  .clock-time { font-size: 22px; }
  .clock-date { font-size: 11px; }
}
</style>
