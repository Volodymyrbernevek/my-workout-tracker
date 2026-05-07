<template>
  <header class="app-header">
    <h1>My Training Tracker</h1>
    <span class="env-badge" :class="envStatus.toLowerCase().replace(' ', '-')">
      {{ envStatus }}
    </span>
  </header>
</template>

<script setup>
import { ref } from 'vue'
// Отримуємо змінну з оточення через вбудований у Vite механізм
const envStatus = ref(import.meta.env.VITE_APP_STATUS || 'Local')
</script>

<style scoped>
.app-header {
  text-align: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #f0fdf4;
  padding-bottom: 10px;
}
.app-header h1 {
  color: #42b883;
  margin: 0;
  font-size: 2.2em;
}
.app-header p {
  color: #666;
  margin: 5px 0 0;
  font-style: italic;
}
.env-badge {
  display: inline-block;
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: bold;
  border-radius: 20px;
  margin-top: 8px;
  text-transform: uppercase;
}
</style>
