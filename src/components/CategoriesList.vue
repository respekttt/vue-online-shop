<script setup>
import { ref, onMounted } from 'vue';

const categories = ref([]);

// Завантаження категорій
const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/categories');
    if (!response.ok) {
      throw new Error('Server error');
    }
    categories.value = await response.json();
  } catch (error) {
    console.error('Помилка завантаження категорій:', error);
  }
};

// Видалення категорії
const deleteCategory = async (id) => {
  if (!confirm('Ви впевнені, що хочете видалити цю категорію? Це може видалити і товари в ній!')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/categories/${id}`, {
      method: 'DELETE'
    });
    
    if (response.ok) {
      // Видаляємо з екрана
      categories.value = categories.value.filter(c => c.id !== id);
      alert('Категорію видалено');
    } else {
      const data = await response.json();
      alert(data.error || 'Помилка видалення (можливо, в категорії є товари)');
    }
  } catch (error) {
    console.error(error);
    alert('Помилка з\'єднання');
  }
};

onMounted(() => {
  fetchCategories();
});
</script>

<template>
  <div class="list-container">
    <div class="header-line">
      <h1>Список категорій</h1>
      <router-link to="/categories/create" class="btn-add">+ Створити категорію</router-link>
    </div>

    <table class="styled-table" v-if="categories.length > 0">
      <thead>
        <tr>
          <th>ID</th>
          <th>Назва</th>
          <th>Опис</th>
          <th style="width: 180px;">Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="category in categories" :key="category.id">
          <td>{{ category.id }}</td>
          <td class="fw-bold">{{ category.name }}</td>
          <td>{{ category.description }}</td>
          <td class="actions">
            <router-link :to="`/categories/${category.id}`" class="btn btn-show" title="Перегляд">👁</router-link>
            <router-link :to="`/categories/${category.id}/edit`" class="btn btn-edit" title="Редагувати">✎</router-link>
            <button @click="deleteCategory(category.id)" class="btn btn-delete" title="Видалити">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-else class="empty-msg">
      Категорій поки немає або сервер вимкнено.
    </div>
  </div>
</template>

<style scoped>
/* Ті самі стилі, що й в ProductsList.vue */
.list-container { max-width: 900px; margin: 30px auto; font-family: 'Segoe UI', sans-serif; }
.header-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

/* Кнопка додавання (зелена) */
.btn-add { 
  background-color: #42b883; 
  color: white; 
  padding: 10px 20px; 
  text-decoration: none; 
  border-radius: 5px; 
  font-weight: bold; 
  transition: 0.3s;
}
.btn-add:hover { background-color: #3aa876; }

/* Таблиця */
.styled-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; }
.styled-table th, .styled-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
.styled-table th { background-color: #f8f9fa; color: #35495e; }

.fw-bold { font-weight: 600; color: #2c3e50; text-transform: capitalize; }

/* Дії */
.actions { display: flex; gap: 8px; }

.btn { 
  border: none; 
  padding: 6px 10px; 
  border-radius: 4px; 
  cursor: pointer; 
  transition: 0.2s; 
  font-size: 1rem;
  text-decoration: none; 
  display: inline-block;
  color: white;
}

.btn-show { background-color: #35495e; }
.btn-show:hover { background-color: #2c3e50; }

.btn-edit { background-color: #f0ad4e; }
.btn-edit:hover { background-color: #ec971f; }

.btn-delete { background-color: #ff4d4f; }
.btn-delete:hover { background-color: #d9363e; }

.empty-msg { text-align: center; color: gray; margin-top: 20px; font-size: 1.1rem; }
</style>