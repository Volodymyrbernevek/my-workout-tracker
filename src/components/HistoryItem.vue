<template>
  <div class="history-card">
    <div class="history-info">
      <strong>{{ item.exercise }}</strong>
      <div class="completed-stats">
        <span v-if="item.results.weight > 0">{{ item.results.weight }}кг </span>
        <span v-if="item.results.weight > 0 && item.results.reps > 0">x </span>
        <span v-if="item.results.reps > 0">{{ item.results.reps }}</span>
        <span v-if="item.results.distance > 0"
          >{{ item.results.distance }}км
        </span>
        <span v-if="item.results.distance > 0 && item.results.duration > 0"
          >/
        </span>
        <span v-if="item.results.duration > 0"
          >{{ item.results.duration }}хв</span
        >
      </div>
    </div>
    <span class="status-tag">ВИКОНАНО</span>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.history-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 8px;
  background: #fafafa;
  opacity: 0.8;
}
.history-info {
  flex: 1;
  word-break: break-word;
  padding-right: 10px;
  padding-left: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}
.history-info strong {
  text-decoration: line-through;
  color: #777;
}
.completed-stats {
  color: #42b883;
  font-weight: bold;
  margin-top: 5px;
  opacity: 0.6;
}
.status-tag {
  background: #42b883;
  color: white;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}
</style>
