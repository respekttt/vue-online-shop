<script setup>
import { ref, onMounted } from 'vue';

const products = ref([]);

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (response.ok) {
      products.value = await response.json();
    }
  } catch (e) {
    console.error('Помилка:', e);
  }
};

const deleteProduct = async (id) => {
  if (!confirm('Ви впевнені, що хочете видалити цей товар?')) return;

  try {
    const response = await fetch(`http://localhost:3000/api/products/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      products.value = products.value.filter(p => p.id !== id);
      alert('Товар успішно видалено!');
    } else {
      alert('Помилка при видаленні');
    }
  } catch (e) {
    console.error(e);
    alert('Помилка з\'єднання');
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="list-container">
    <div class="header-line">
      <h1>Список товарів (Admin)</h1>
      <router-link to="/products/create" class="btn-add">+ Додати товар</router-link>
    </div>
    
    <table class="products-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Фото</th>
          <th>Назва</th>
          <th>Категорія</th>
          <th>Ціна</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.id">
          <td>{{ product.id }}</td>
          <td>
            <img :src="product.image" alt="img" class="thumb" />
          </td>
          <td class="fw-bold">{{ product.title }}</td>
          <td>
            <span class="badge">{{ product.category }}</span>
          </td>
          <td>{{ product.price }} $</td>
          <td class="actions">
            <router-link :to="'/products/' + product.id" class="btn btn-show" title="Перегляд">👁</router-link>
            <router-link :to="'/products/' + product.id + '/edit'" class="btn btn-edit" title="Редагувати">✎</router-link>
            <button @click="deleteProduct(product.id)" class="btn btn-delete" title="Видалити">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="products.length === 0" class="empty-msg">
      Товарів немає або сервер вимкнено.
    </div>
  </div>
</template>

<style scoped>
.list-container { max-width: 900px; margin: 30px auto; font-family: sans-serif; }
.header-line { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }

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

.products-table { width: 100%; border-collapse: collapse; background: white; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-radius: 8px; overflow: hidden; }
.products-table th, .products-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
.products-table th { background-color: #f8f9fa; color: #35495e; }

.thumb { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #ddd; }
.badge { background-color: #eafbf4; color: #42b883; padding: 4px 8px; border-radius: 12px; font-size: 0.85rem; text-transform: uppercase; font-weight: bold; }
.fw-bold { font-weight: 600; }

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
  line-height: 1.2;
}

.btn-show { background-color: #35495e; color: white; }
.btn-show:hover { background-color: #2c3e50; }

.btn-edit { background-color: #f0ad4e; color: white; }
.btn-edit:hover { background-color: #ec971f; }

.btn-delete { background-color: #ff4d4f; color: white; }
.btn-delete:hover { background-color: #d9363e; }

.empty-msg { text-align: center; color: gray; margin-top: 20px; }
</style>