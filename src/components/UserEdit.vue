<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const userId = route.params.id;

const form = ref({ name: '', email: '' });

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/users/${userId}`);
    if (res.ok) {
      const data = await res.json();
      form.value = { name: data.name, email: data.email };
    }
  } catch (e) {
    console.error(e);
  }
});

const saveChanges = async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value)
    });

    if (res.ok) {
      alert('Зміни збережено!');
      router.push('/users');
    } else {
      alert('Помилка при збереженні');
    }
  } catch (e) {
    console.error(e);
  }
};
</script>

<template>
  <div class="page-container">
    <h1>Редагування користувача</h1>
    
    <form @submit.prevent="saveChanges" class="edit-form">
      <label>Ім'я:</label>
      <input v-model="form.name" required />
      
      <label>Email:</label>
      <input v-model="form.email" type="email" required />
      
      <button type="submit" class="btn-save">Зберегти зміни</button>
    </form>
    
    <router-link to="/users" class="back-link">Скасувати</router-link>
  </div>
</template>

<style scoped>
.page-container { padding: 20px; max-width: 400px; margin: 0 auto; font-family: sans-serif; }
.edit-form { display: flex; flex-direction: column; gap: 15px; background: #f9f9f9; padding: 20px; border-radius: 8px; border: 1px solid #ddd; }
input { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.btn-save { padding: 10px; background: #42b883; color: white; border: none; cursor: pointer; border-radius: 4px; font-size: 1rem; }
.btn-save:hover { background: #3aa876; }
.back-link { display: block; margin-top: 15px; text-align: center; color: #666; text-decoration: none; }
</style>