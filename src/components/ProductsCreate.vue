<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const categories = ref([]);
const form = ref({
  name: '',
  category_id: null,
  price: 0,
  image: '',
  description: '',
  stock_quantity: 1
});

onMounted(async () => {
  const res = await fetch('http://localhost:3000/api/categories');
  categories.value = await res.json();
});

const createProduct = async () => {
  await fetch('http://localhost:3000/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  });
  alert('Товар створено!');
  router.push('/products');
};
</script>

<template>
  <div class="form-container">
    <h1>Новий товар</h1>
    <form @submit.prevent="createProduct">
      <label>Назва:</label>
      <input v-model="form.name" required />

      <label>Категорія:</label>
      <select v-model="form.category_id" required>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>

      <label>Ціна ($):</label>
      <input type="number" v-model="form.price" required />

      <label>Посилання на фото:</label>
      <input v-model="form.image" required placeholder="https://..." />

      <label>Кількість:</label>
      <input type="number" v-model="form.stock_quantity" />

      <label>Опис:</label>
      <textarea v-model="form.description"></textarea>

      <button type="submit">Створити</button>
    </form>
  </div>
</template>

<style scoped>
.form-container { max-width: 500px; margin: 20px auto; padding: 20px; font-family: sans-serif; }
form { display: flex; flex-direction: column; gap: 10px; }
input, select, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 10px; background: #42b883; color: white; border: none; cursor: pointer; margin-top: 10px; }
</style>