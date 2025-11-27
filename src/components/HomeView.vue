<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const products = ref([]); 
const currentUser = ref(null);

const fetchProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    const data = await response.json();
    products.value = data.slice(0, 4); 
  } catch (error) {
    console.error('Помилка завантаження:', error);
  }
};

const checkAuth = () => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    currentUser.value = JSON.parse(storedUser);
  }
};

onMounted(() => {
  fetchProducts();
  checkAuth();
});

const handleLogout = () => {
  localStorage.removeItem('user');
  currentUser.value = null;
  alert('Ви вийшли з акаунту');
  router.push('/login');
};

const addToCart = (product) => {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${product.title} додано до кошика!`);
};

const login = () => router.push('/login');
const registration = () => router.push('/registration');
const catalog = () => router.push('/catalog');
const cart = () => router.push('/cart');
</script>

<template>
  <div class="shop-container">
    
    <header class="header">
      <div class="logo">MyStore</div>
      
      <nav class="nav">
        <a href="#" class="nav-link">Головна</a>
        <a href="#" class="nav-link" @click="catalog">Каталог</a>
      </nav>

      <div v-if="currentUser" class="user-profile">
        <span class="user-name">👤 {{ currentUser.name }}</span>
        <button @click="handleLogout" class="btn-logout">Вийти</button>
      </div>

      <div v-else class="auth-buttons">
        <button @click="login" class="btn-login">Увійти</button>
        <button @click="registration" class="btn-register">Реєстрація</button>
      </div>

      <div class="cart-icon" @click="cart">🛒 Кошик</div>
    </header>

    <section class="products-section">
      <div class="hero-banner">
        <h1 v-if="currentUser">З поверненням, {{ currentUser.name }}!</h1>
        <h1 v-else>Ласкаво просимо до MyStore</h1>
        <p>Найкращі гаджети за найкращими цінами</p>
      </div>

      <h2>Популярні товари</h2>
      
      <div v-if="products.length === 0" style="text-align: center; color: gray;">
        <p>Завантаження... (або сервер не запущено)</p>
      </div>

      <div class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <img :src="product.image" :alt="product.title" class="product-img" />
          <div class="product-info">
            <h3>{{ product.title }}</h3>
            <p class="price">{{ product.price }} $</p>
            <button @click="addToCart(product)" class="buy-button">Додати до кошика</button>
          </div>
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <button @click="catalog" class="btn-show-more">Дивитися весь каталог</button>
      </div>
    </section>

  </div>
</template>

<style scoped>
.shop-container { font-family: 'Segoe UI', sans-serif; color: #333; }

.header { display: flex; align-items: center; justify-content: space-between; padding: 1rem 2rem; background-color: #fff; box-shadow: 0 2px 10px rgba(0,0,0,0.1); position: sticky; top: 0; z-index: 100; }
.logo { font-size: 1.5rem; font-weight: bold; color: #42b883; margin-right: 2rem; }
.nav { margin-right: auto; }
.nav-link { margin-right: 20px; text-decoration: none; color: #555; font-weight: 500; }
.nav-link:hover { color: #42b883; }

.user-profile { display: flex; align-items: center; gap: 15px; margin-right: 20px; }
.user-name { font-weight: bold; color: #35495e; }
.btn-logout { background: transparent; border: 1px solid #ff4d4f; color: #ff4d4f; padding: 8px 16px; border-radius: 4px; cursor: pointer; transition: 0.3s; }
.btn-logout:hover { background-color: #ff4d4f; color: white; }

.auth-buttons { display: flex; gap: 10px; margin-right: 20px; }
.btn-login { background: transparent; border: 1px solid #42b883; color: #42b883; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
.btn-login:hover { background-color: #eafbf4; }
.btn-register { background-color: #42b883; border: 1px solid #42b883; color: white; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
.btn-register:hover { background-color: #3aa876; }
.cart-icon { font-weight: bold; cursor: pointer; }

.hero-banner { text-align: center; background: #f8f9fa; padding: 2rem; margin-bottom: 2rem; border-radius: 8px; }
.hero-banner h1 { margin: 0 0 10px 0; color: #35495e; }

.products-section { padding: 2rem; max-width: 1200px; margin: 0 auto; }
.products-section h2 { text-align: center; margin-bottom: 2rem; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 2rem; }
.product-card { border: 1px solid #eee; border-radius: 10px; overflow: hidden; background: white; transition: transform 0.2s; display: flex; flex-direction: column;}
.product-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
.product-img { width: 100%; height: 200px; object-fit: cover; }
.product-info { padding: 1rem; text-align: center; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;}
.price { font-size: 1.2rem; font-weight: bold; color: #35495e; margin: 10px 0; }
.buy-button { background-color: #35495e; color: white; border: none; padding: 10px; width: 100%; border-radius: 5px; cursor: pointer; }
.buy-button:hover { background-color: #42b883; }

.btn-show-more { background: transparent; border: 2px solid #35495e; color: #35495e; padding: 10px 30px; font-size: 1rem; cursor: pointer; border-radius: 30px; transition: 0.3s; }
.btn-show-more:hover { background: #35495e; color: white; }
</style>