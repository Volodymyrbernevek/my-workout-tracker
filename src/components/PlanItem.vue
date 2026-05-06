<template>
    <div class="plan-card" @click.self="$emit('edit', item)">
      <div class="plan-info" @click="$emit('edit', item)">
        <strong>{{ item.name }}</strong>
        <div class="plan-stats">
          <span v-if="item.plannedResults.weight > 0">{{ item.plannedResults.weight }}кг </span>
          <span v-if="item.plannedResults.weight > 0 && item.plannedResults.reps > 0">x </span>
          <span v-if="item.plannedResults.reps > 0">{{ item.plannedResults.reps }}</span>
          <span v-if="item.plannedResults.distance > 0">{{ item.plannedResults.distance }}км </span>
          <span v-if="item.plannedResults.distance > 0 && item.plannedResults.duration > 0">/ </span>
          <span v-if="item.plannedResults.duration > 0">{{ item.plannedResults.duration }}хв</span>
        </div>
      </div>
      <button class="mini-done-btn" @click.stop="$emit('complete', item.id)">✅ Виконано</button>
    </div>
  </template>
  
  <script setup>
  defineProps(['item']);
  defineEmits(['edit', 'complete']);
  </script>
  
  <style scoped>
  .plan-card { display: flex; justify-content: space-between; align-items: center; padding: 15px; margin-bottom: 10px; border: 1px solid #eee; border-radius: 12px; background: #fff; cursor: pointer; transition: background 0.2s; }
  .plan-card:hover { background: #f9f9f9; }
  .plan-info { flex: 1; word-break: break-word; padding-right: 10px; padding-left: 10px; display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
  .plan-stats { color: #42b883; font-weight: bold; margin-top: 5px; }
  .mini-done-btn { padding: 8px 12px; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; border-radius: 8px; cursor: pointer; }
  </style>