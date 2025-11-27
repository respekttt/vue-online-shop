<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const selectedCategory = ref('all');
const products = ref([]); 
const categories = ref([]);

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    if (response.ok) {
      products.value = await response.json();
    }
  } catch (error) {
    console.error('Помилка завантаження товарів:', error);
  }
};

const fetchCategories = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/categories');
    if (response.ok) {
      categories.value = await response.json();
    }
  } catch (error) {
    console.error('Помилка завантаження категорій:', error);
  }
};

onMounted(() => {
  fetchProducts();
  fetchCategories();
});

const filteredProducts = computed(() => {
  if (selectedCategory.value === 'all') {
    return products.value;
  }
  return products.value.filter(product => product.category === selectedCategory.value);
});

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.title} додано до кошика!`);
};

const goBack = () => router.push('/');
const goToCart = () => router.push('/cart');
</script>

<template>
  <div class="catalog-container">
    
    <div class="catalog-header">
      <h1>Каталог товарів</h1>
      <div class="header-buttons">
        <button @click="goBack" class="btn-outline">⬅ На головну</button>
        <button @click="goToCart" class="btn-cart">Кошик 🛒</button>
      </div>
    </div>

    <div class="filters">
      <button 
        @click="selectedCategory = 'all'" 
        :class="{ active: selectedCategory === 'all' }">
        Всі
      </button>

      <button 
        v-for="category in categories" 
        :key="category.id"
        @click="selectedCategory = category.name" 
        :class="{ active: selectedCategory === category.name }">
        {{ category.name }}
      </button>
    </div>

    <div class="products-grid">
      <div v-for="product in filteredProducts" :key="product.id" class="product-card">
        <img :src="product.image" :alt="product.title" class="product-img" />
        <div class="product-info">
          <h3>{{ product.title }}</h3>
          <p class="category-label">{{ product.category }}</p>
          <p class="price">{{ product.price }} $</p>
          <button @click="addToCart(product)" class="buy-button">Додати до кошика</button>
        </div>
      </div>
    </div>

    <div v-if="products.length === 0" class="loading-msg">
      Завантаження...
    </div>

    <div v-else-if="filteredProducts.length === 0" class="no-items">
      У цій категорії поки немає товарів.
    </div>

  </div>
</template>

<style scoped>
.catalog-container { max-width: 1200px; margin: 0 auto; padding: 2rem; font-family: 'Segoe UI', sans-serif; }
.catalog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 1rem; }
.header-buttons { display: flex; gap: 10px; }
.btn-outline { background: transparent; border: 1px solid #35495e; padding: 8px 16px; cursor: pointer; border-radius: 4px; transition: 0.3s; }
.btn-outline:hover { background: #eee; }
.btn-cart { background: #42b883; color: white; border: none; padding: 8px 16px; cursor: pointer; border-radius: 4px; }
.filters { display: flex; gap: 10px; margin-bottom: 2rem; flex-wrap: wrap; }
.filters button { padding: 8px 16px; border: 1px solid #ddd; background: white; border-radius: 20px; cursor: pointer; transition: all 0.3s; text-transform: capitalize; }
.filters button:hover { border-color: #42b883; color: #42b883; }
.filters button.active { background-color: #42b883; color: white; border-color: #42b883; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; }
.product-card { border: 1px solid #eee; border-radius: 10px; overflow: hidden; background: white; transition: transform 0.2s; display: flex; flex-direction: column; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.product-img { width: 100%; height: 200px; object-fit: cover; }
.product-info { padding: 1rem; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;}
.category-label { font-size: 0.8rem; color: #999; text-transform: uppercase; margin: 5px 0; }
.price { font-size: 1.2rem; font-weight: bold; color: #35495e; margin: 10px 0; }
.buy-button { background-color: #35495e; color: white; border: none; padding: 10px; width: 100%; border-radius: 5px; cursor: pointer; }
.buy-button:hover { background-color: #42b883; }
.no-items, .loading-msg { text-align: center; color: #777; margin-top: 2rem; font-size: 1.2rem;}
</style>