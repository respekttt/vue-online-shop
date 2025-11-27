<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const cartItems = ref([]);

onMounted(() => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    try {
      cartItems.value = JSON.parse(savedCart);
    } catch (e) {
      console.error("Помилка зчитування кошика", e);
      localStorage.removeItem('cart');
    }
  }
});

const removeFromCart = (index) => {
  cartItems.value.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cartItems.value));
};


const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + Number(item.price);
  }, 0);
});

const goBack = () => router.push('/');
const goCatalog = () => router.push('/catalog');

const checkout = () => {
  if (cartItems.value.length === 0) return;
  alert("Замовлення успішно оформлено!");
  cartItems.value = [];
  localStorage.removeItem('cart');
};
</script>

<template>
  <div class="cart-container">
    <h2>Ваш Кошик</h2>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>У кошику поки нічого немає</p>
      <button @click="goBack" class="btn-back">Повернутися на головну</button>
      <button @click="goCatalog" class="btn-back">Повернутися до каталогу</button>
    </div>

    <div v-else>
      <div class="cart-list">
        <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
          <img :src="item.image" class="item-img" />
          <div class="item-info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.price }} $</p>
          </div>
          <button @click="removeFromCart(index)" class="btn-remove">Видалити</button>
        </div>
      </div>

      <div class="cart-summary">
        <h3>До сплати: {{ totalPrice.toFixed(2) }} $</h3>
        <button @click="checkout" class="btn-checkout">Оформити замовлення</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container { max-width: 800px; margin: 0 auto; padding: 2rem; font-family: sans-serif; }
.empty-cart { text-align: center; margin-top: 50px; }
.cart-item { display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 15px 0; }
.item-img { width: 80px; height: 80px; object-fit: cover; margin-right: 20px; border-radius: 5px;}
.item-info { flex-grow: 1; }
.btn-remove { background: #ff4d4f; color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; transition: 0.3s;}
.btn-remove:hover { background: #d9363e; }
.btn-back { background: #42b883; color: white; border: none; padding: 10px 20px; margin-top: 10px; cursor: pointer; margin-left: 10px; border-radius: 4px;}
.cart-summary { margin-top: 20px; text-align: right; font-weight: bold; font-size: 1.2rem; }
.btn-checkout { background: #35495e; color: white; border: none; padding: 12px 24px; margin-left: 20px; cursor: pointer; border-radius: 4px; font-size: 1rem;}
.btn-checkout:hover { background: #2c3e50; }
</style>