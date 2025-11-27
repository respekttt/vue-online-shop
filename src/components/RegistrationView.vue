<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

// RegEx для Email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// RegEx для Імені:
// a-zA-Z -> Англійські літери
// а-яА-Я -> Кирилиця (основна)
// іІїЇєЄґҐ -> Специфічні українські літери
// '’ -> Апострофи (для імен типу Дар'я)
// \s- -> Пробіл та дефіс
const nameRegex = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ'’\s-]+$/;

// (ОПЦІОНАЛЬНО) Функція для миттєвого видалення заборонених символів при вводі
const onNameInput = () => {
  // Видаляємо все, що НЕ є буквами, пробілом, дефісом або апострофом
  name.value = name.value.replace(/[^a-zA-Zа-яА-ЯіІїЇєЄґҐ'’\s-]/g, '');
  clearError('name');
};

const validateForm = () => {
  let isValid = true;
  Object.keys(errors).forEach(key => errors[key] = '');

  // --- ВАЛІДАЦІЯ ІМЕНІ ---
  if (!name.value.trim()) {
    errors.name = "Ім'я обов'язкове";
    isValid = false;
  } else if (name.value.length < 2) {
    errors.name = "Ім'я має бути не менше 2 символів";
    isValid = false;
  } else if (!nameRegex.test(name.value)) {
    errors.name = "Ім'я може містити тільки літери";
    isValid = false;
  }

  // --- ВАЛІДАЦІЯ EMAIL ---
  if (!email.value) {
    errors.email = "Email обов'язковий";
    isValid = false;
  } else if (!emailRegex.test(email.value)) {
    errors.email = "Введіть коректний email";
    isValid = false;
  }

  // --- ВАЛІДАЦІЯ ПАРОЛЯ ---
  if (!password.value) {
    errors.password = "Пароль обов'язковий";
    isValid = false;
  } else if (password.value.length < 6) {
    errors.password = "Пароль має бути не менше 6 символів";
    isValid = false;
  }

  // --- ВАЛІДАЦІЯ ПІДТВЕРДЖЕННЯ ---
  if (!confirmPassword.value) {
    errors.confirmPassword = "Підтвердіть пароль";
    isValid = false;
  } else if (password.value !== confirmPassword.value) {
    errors.confirmPassword = "Паролі не співпадають";
    isValid = false;
  }

  return isValid;
};

const clearError = (field) => {
  errors[field] = '';
};

const handleRegister = async () => {
  if (!validateForm()) return;

  try {
    const response = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name.value,
        email: email.value,
        password: password.value
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || 'Помилка реєстрації');
    } else {
      alert('Реєстрація успішна! Тепер увійдіть.');
      router.push('/login');
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
      <h2>Реєстрація</h2>
      <form @submit.prevent="handleRegister" novalidate>
        
        <div class="form-group">
          <label>Ім'я</label>
          <!-- Використовуємо onNameInput для фільтрації -->
          <input 
            v-model="name" 
            type="text" 
            placeholder="Ваше ім'я" 
            :class="{ 'is-invalid': errors.name }"
            @input="onNameInput"
          />
          <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label>Email</label>
          <input 
            v-model="email" 
            type="email" 
            placeholder="email@example.com" 
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
          />
          <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
        </div>
        
        <div class="form-group">
          <label>Пароль</label>
          <input 
            v-model="password" 
            type="password" 
            :class="{ 'is-invalid': errors.password }"
            @input="clearError('password')"
          />
          <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label>Повторіть пароль</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            :class="{ 'is-invalid': errors.confirmPassword }"
            @input="clearError('confirmPassword')"
          />
          <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" class="auth-btn">Створити аккаунт</button>
      </form>
      
      <p class="switch-auth">
        Вже є аккаунт? <router-link to="/login">Увійти</router-link>
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
input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 1rem; transition: border-color 0.3s; }
input.is-invalid { border-color: #e74c3c; }
.error-text { color: #e74c3c; font-size: 0.85rem; margin-top: 5px; display: block; }
.auth-btn { width: 100%; padding: 12px; background-color: #42b883; color: white; border: none; border-radius: 5px; font-size: 1.1rem; cursor: pointer; margin-top: 1rem; }
.auth-btn:hover { background-color: #3aa876; }
.switch-auth { margin-top: 15px; font-size: 0.9rem; }
.switch-auth a { color: #42b883; text-decoration: none; font-weight: bold; }
</style>