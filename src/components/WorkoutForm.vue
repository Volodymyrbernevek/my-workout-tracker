<template>
    <div class="logger-card draft">
      <h2>{{ editingId ? 'Редагувати вправу' : 'Нова вправа' }}</h2>
      <div class="setup-row">
        <div class="input-group">
          <label>Категорія:</label>
          <select :value="category" @change="$emit('update:category', $event.target.value)">
            <option value="" disabled>Оберіть тип...</option>
            <option v-for="(fields, cat) in categorySettings" :key="cat" :value="cat">{{ cat }}</option>
          </select>
        </div>
        <div class="input-group">
          <label>Назва вправи:</label>
          <input :value="name" @input="$emit('update:name', $event.target.value)" type="text" placeholder="Наприклад: Присідання" />
        </div>
      </div>
  
      <div v-if="pastData" class="past-hint">
        💡 Твій останній результат: <slot name="past-data"></slot>
      </div>
  
      <div v-if="category" class="form-fields">
        <div v-for="field in categorySettings[category]" :key="field">
          <label>{{ field === 'weight' ? 'Вага (кг)' : field === 'reps' ? 'Повторення' : field === 'distance' ? 'Дистанція (км)' : 'Час (хв)' }}</label>
          <input v-model.number="form[field]" type="number" />
        </div>
      </div>
  
      <div class="draft-btns">
        <button class="add-plan-btn" :disabled="!name || !category" @click="$emit('confirm')">
          {{ editingId ? '💾 Зберегти зміни' : '➕ Додати в чергу' }}
        </button>
        <button class="cancel-btn" @click="$emit('cancel')">Скасувати</button>
      </div>
    </div>
  </template>
  
  <script setup>
  defineProps(['editingId', 'category', 'name', 'form', 'categorySettings', 'pastData']);
  defineEmits(['update:category', 'update:name', 'confirm', 'cancel']);
  </script>
  
  <style scoped>
  .logger-card.draft { border: 2px solid #42b883; padding: 25px; border-radius: 12px; background: #fff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
  .setup-row { display: flex; gap: 20px; margin-bottom: 20px; }
  .input-group { display: flex; flex-direction: column; gap: 5px; flex: 1; }
  .input-group select, .input-group input { padding: 10px; border: 1px solid #ccc; border-radius: 8px; }
  .form-fields { display: flex; gap: 70px; margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 8px; }
  .form-fields div { display: flex; flex-direction: column; gap: 5px; }
  .form-fields input { width: 80px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
  .add-plan-btn { padding: 12px 25px; background: #42b883; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold; }
  .add-plan-btn:disabled { background: #ccc; cursor: not-allowed; }
  .cancel-btn { background: none; border: none; color: #999; cursor: pointer; margin-left: 15px; }
  .past-hint { font-size: 0.9em; padding: 10px; background: #eefcf5; color: #2c7a51; border-radius: 6px; margin-bottom: 15px; }
  </style>