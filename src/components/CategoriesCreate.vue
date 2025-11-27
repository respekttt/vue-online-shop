<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  name: '',
  description: ''
});

const createCategory = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    if (response.ok) {
      alert('Категорію успішно створено!');
      router.push('/categories');
    } else {
      alert('Помилка при створенні');
    }
  } catch (error) {
    console.error(error);
    alert('Помилка з\'єднання');
  }
};
</script>

<template>
  <div class="form-container">
    <h1>Створити категорію</h1>
    
    <form @submit.prevent="createCategory">
      <label>Назва:</label>
      <input v-model="form.name" type="text" required placeholder="Наприклад: Монітори" />
      
      <label>Опис:</label>
      <textarea v-model="form.description" placeholder="Короткий опис категорії..."></textarea>
      
      <button type="submit" class="btn-save">Зберегти</button>
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

h1 {
  text-align: center;
  color: #35495e;
  margin-bottom: 1.5rem;
}

form { 
  display: flex; 
  flex-direction: column; 
  gap: 15px; 
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
}

label {
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
}

input, textarea { 
  padding: 10px; 
  border: 1px solid #ccc; 
  border-radius: 4px; 
  font-size: 1rem;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #42b883;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.btn-save { 
  padding: 12px; 
  background-color: #42b883;
  color: white; 
  border: none; 
  cursor: pointer; 
  border-radius: 4px; 
  font-size: 1.1rem;
  font-weight: bold;
  transition: background-color 0.3s;
}

.btn-save:hover { 
  background-color: #3aa876; 
}

.back-link { 
  display: block; 
  margin-top: 15px; 
  text-align: center; 
  color: #666; 
  text-decoration: none; 
  font-weight: 500;
}

.back-link:hover {
  color: #35495e;
  text-decoration: underline;
}
</style>