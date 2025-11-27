<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const categories = ref([]);
const form = ref({});

onMounted(async () => {
  const catRes = await fetch('http://localhost:3000/api/categories');
  categories.value = await catRes.json();

  const prodRes = await fetch(`http://localhost:3000/api/products/${route.params.id}`);
  form.value = await prodRes.json();
});

const updateProduct = async () => {
  await fetch(`http://localhost:3000/api/products/${route.params.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form.value)
  });
  alert('Товар оновлено!');
  router.push('/products');
};
</script>

<template>
  <div class="form-container">
    <h1>Редагування товару</h1>
    <form @submit.prevent="updateProduct">
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

      <label>Фото:</label>
      <input v-model="form.image" required />

      <label>Кількість:</label>
      <input type="number" v-model="form.stock_quantity" />

      <label>Опис:</label>
      <textarea v-model="form.description"></textarea>

      <button type="submit">Зберегти зміни</button>
    </form>
  </div>
</template>

<style scoped>
.form-container { max-width: 500px; margin: 20px auto; padding: 20px; font-family: sans-serif; }
form { display: flex; flex-direction: column; gap: 10px; }
input, select, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 10px; background: #f0ad4e; color: white; border: none; cursor: pointer; margin-top: 10px; }
</style>