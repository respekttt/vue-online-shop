<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const categoryId = route.params.id;

const form = ref({
  name: '',
  description: ''
});

// 1. Завантажуємо поточні дані категорії
onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`);
    if (response.ok) {
      const data = await response.json();
      form.value = { name: data.name, description: data.description };
    } else {
      alert('Категорію не знайдено');
      router.push('/categories');
    }
  } catch (error) {
    console.error(error);
  }
});

// 2. Оновлюємо дані
const updateCategory = async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    if (response.ok) {
      alert('Категорію успішно оновлено!');
      router.push('/categories');
    } else {
      alert('Помилка при оновленні');
    }
  } catch (error) {
    console.error(error);
    alert('Помилка з\'єднання');
  }
};
</script>

<template>
  <div class="form-container">
    <h1>Редагувати категорію</h1>
    
    <form @submit.prevent="updateCategory">
      <label>Назва:</label>
      <input v-model="form.name" type="text" required />
      
      <label>Опис:</label>
      <textarea v-model="form.description" rows="4"></textarea>
      
      <button type="submit" class="btn-save">Зберегти зміни</button>
    </form>
    
    <router-link to="/categories" class="back-link">Скасувати</router-link>
  </div>
</template>

<style scoped>
.form-container { 
  max-width: 500px; 
  margin: 20px auto; 
  padding: 20px; 
  font-family: 'Segoe UI', sans-serif; 
}

h1 { text-align: center; color: #35495e; margin-bottom: 1.5rem; }

form { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

label { font-weight: bold; color: #555; margin-bottom: 5px; }

input, textarea { 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 4px; 
  font-size: 1rem;
}

input:focus, textarea:focus { outline: none; border-color: #42b883; }

.btn-save { 
  padding: 12px; 
  background-color: #f0ad4e; /* Помаранчевий для редагування */
  color: white; 
  border: none; 
  cursor: pointer; 
  border-radius: 4px; 
  font-size: 1.1rem;
  font-weight: bold;
  transition: 0.3s;
}
.btn-save:hover { background-color: #ec971f; }

.back-link { 
  display: block; 
  margin-top: 15px; 
  text-align: center; 
  color: #666; 
  text-decoration: none; 
  font-weight: 500;
}
.back-link:hover { color: #35495e; text-decoration: underline; }
</style>