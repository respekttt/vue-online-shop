<script setup>
import { ref, onMounted } from 'vue';

const users = ref([]);

const fetchUsers = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/users');
    if (response.ok) {
      users.value = await response.json();
    }
  } catch (e) {
    console.error('Помилка:', e);
  }
};

const deleteUser = async (id) => {
  if (!confirm('Ви впевнені, що хочете видалити цього користувача?')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      users.value = users.value.filter(user => user.id !== id);

      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      if (currentUser && currentUser.id === id) {
        localStorage.removeItem('user');
        localStorage.removeItem('cart');
        
        alert('Ви видалили свій власний акаунт. Вихід із системи...');
        

        window.location.href = '/login'; 
      } else {
        alert('Користувача видалено!');
      }

    } else {
      alert('Не вдалося видалити (можливо, помилка сервера)');
    }
  } catch (e) {
    console.error(e);
    alert('Помилка з\'єднання');
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<template>
  <div class="users-container">
    <h1>Список користувачів (Admin Panel)</h1>
    
    <ul class="user-list">
      <li v-for="user in users" :key="user.id" class="user-item">
        <div class="user-info">
          <strong>{{ user.name }}</strong> <br>
          <small>{{ user.email }}</small>
        </div>
        
        <div class="actions">
          <router-link :to="'/users/' + user.id" class="btn btn-show">Show</router-link>
          <router-link :to="'/users/' + user.id + '/edit'" class="btn btn-edit">Edit</router-link>
          
          <button @click="deleteUser(user.id)" class="btn btn-delete">Delete</button>
        </div>
      </li>
    </ul>

    <div v-if="users.length === 0" style="text-align:center; color:gray; margin-top: 20px;">
      Користувачів не знайдено або сервер вимкнено.
    </div>
  </div>
</template>

<style scoped>
.users-container { max-width: 700px; margin: 20px auto; font-family: sans-serif; }
.user-list { list-style: none; padding: 0; }
.user-item { display: flex; justify-content: space-between; align-items: center; border: 1px solid #ddd; padding: 15px; margin-bottom: 10px; border-radius: 8px; background: #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }

.user-info strong { font-size: 1.1rem; color: #333; }
.user-info small { color: #666; }

.actions { display: flex; gap: 8px; }

.btn { text-decoration: none; padding: 6px 12px; border-radius: 4px; color: white; font-size: 0.9rem; border: none; cursor: pointer; transition: 0.3s; }
.btn-show { background-color: #35495e; }
.btn-show:hover { background-color: #2c3e50; }

.btn-edit { background-color: #f0ad4e; }
.btn-edit:hover { background-color: #ec971f; }

.btn-delete { background-color: #d9534f; }
.btn-delete:hover { background-color: #c9302c; }
</style>