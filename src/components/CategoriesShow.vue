<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const category = ref(null);
const loading = ref(true);

onMounted(async () => {
  const id = route.params.id;
  try {
    const response = await fetch(`http://localhost:3000/api/categories/${id}`);
    
    if (response.ok) {
      category.value = await response.json();
    } else {
      alert('Категорію не знайдено');
    }
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="page-container">
    <h1>Деталі категорії</h1>

    <div v-if="loading" class="status">Завантаження...</div>

    <div v-else-if="category" class="info-card">
      <div class="info-row">
        <strong>ID:</strong> <span>{{ category.id }}</span>
      </div>
      <div class="info-row">
        <strong>Назва:</strong> <span>{{ category.name }}</span>
      </div>
      <div class="info-row">
        <strong>Опис:</strong> <span>{{ category.description || 'Опис відсутній' }}</span>
      </div>

      <div class="actions">
        <router-link to="/categories" class="btn-back">⬅ Назад до списку</router-link>
        <router-link :to="`/categories/${category.id}/edit`" class="btn-edit">✎ Редагувати</router-link>
      </div>
    </div>

    <div v-else class="status">
      Категорію не знайдено.
    </div>
  </div>
</template>

<style scoped>
.page-container { 
  max-width: 600px; 
  margin: 30px auto; 
  font-family: 'Segoe UI', sans-serif; 
  color: #333; 
}

h1 { text-align: center; margin-bottom: 20px; color: #35495e; }

.info-card {
  background: white;
  border: 1px solid #ddd;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.info-row {
  font-size: 1.1rem;
  margin-bottom: 15px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  display: flex;
  justify-content: space-between;
}

.info-row strong { color: #555; }

.actions {
  margin-top: 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-back {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: 0.3s;
}
.btn-back:hover { color: #35495e; }

.btn-edit {
  text-decoration: none;
  background-color: #f0ad4e;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  font-weight: bold;
  transition: 0.3s;
}
.btn-edit:hover { background-color: #ec971f; }

.status { text-align: center; color: gray; margin-top: 20px; }
</style>