<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const userId = route.params.id; // Отримуємо ID з адреси (наприклад, 2)
const user = ref(null);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    // Робимо запит до нашого сервера
    const response = await fetch(`http://localhost:3000/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error('Користувача не знайдено');
    }

    user.value = await response.json();
  } catch (e) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-container">
    <h1>Перегляд користувача (Show)</h1>
    
    <div v-if="loading" class="status">Завантаження...</div>

    <div v-else-if="error" class="error">
      {{ error }}
      <br>
      <router-link to="/users">Повернутися до списку</router-link>
    </div>

    <div v-else-if="user" class="user-card">
      <div class="info-row">
        <strong>ID:</strong> <span>{{ user.id }}</span>
      </div>
      <div class="info-row">
        <strong>Ім'я:</strong> <span>{{ user.name }}</span>
      </div>
      <div class="info-row">
        <strong>Email:</strong> <span>{{ user.email }}</span>
      </div>
      
      <div class="actions">
        <router-link to="/users" class="btn-back">⬅ Назад до списку</router-link>
        <router-link :to="'/users/' + user.id + '/edit'" class="btn-edit">✎ Редагувати</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  max-width: 500px;
  margin: 30px auto;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

h1 { text-align: center; margin-bottom: 20px; }

.user-card {
  background: white;
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.info-row {
  font-size: 1.1rem;
  margin-bottom: 10px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.info-row strong { color: #35495e; display: inline-block; width: 60px; }

.actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.btn-back {
  text-decoration: none;
  color: #666;
  font-weight: bold;
}

.btn-edit {
  text-decoration: none;
  background-color: #f0ad4e;
  color: white;
  padding: 8px 15px;
  border-radius: 4px;
}

.error { color: red; text-align: center; }
.status { text-align: center; color: gray; }
</style>