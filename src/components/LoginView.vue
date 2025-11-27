<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Помилка входу');
    } else {
      alert(`Ласкаво просимо, ${data.user.name}!`);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/');
    }
  } catch (error) {
    console.error(error);
    alert('Помилка з\'єднання з сервером');
  }
};
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>Вхід</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="email@example.com" required />
        </div>
        
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="password" type="password" placeholder="Ваш пароль" required />
        </div>

        <button type="submit" class="auth-btn">Увійти</button>
      </form>
      
      <p class="switch-auth">
        Нема аккаунта? <router-link to="/registration">Зареєструватися</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f4f4f4; }
.auth-card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
h2 { color: #35495e; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; text-align: left; }
label { display: block; margin-bottom: 5px; color: #666; }
input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; }
.auth-btn { width: 100%; padding: 12px; background-color: #42b883; color: white; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; margin-top: 1rem; }
.auth-btn:hover { background-color: #3aa876; }
.switch-auth { margin-top: 15px; font-size: 0.9rem; }
.switch-auth a { color: #42b883; text-decoration: none; font-weight: bold; }
</style>