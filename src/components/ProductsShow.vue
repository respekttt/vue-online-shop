<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const product = ref(null);

onMounted(async () => {
  try {
    const res = await fetch(`http://localhost:3000/api/products/${route.params.id}`);
    if(res.ok) product.value = await res.json();
  } catch (e) { console.error(e); }
});
</script>

<template>
  <div class="container" v-if="product">
    <h1>{{ product.name }}</h1>
    <div class="content">
      <img :src="product.image" class="img-large" />
      <div class="info">
        <p><strong>Ціна:</strong> {{ product.price }} $</p>
        <p><strong>Кількість на складі:</strong> {{ product.stock_quantity }}</p>
        <p><strong>Опис:</strong> {{ product.description }}</p>
        <router-link to="/products" class="btn">Назад до списку</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { padding: 20px; max-width: 800px; margin: 0 auto; }
.content { display: flex; gap: 20px; margin-top: 20px; }
.img-large { width: 300px; border-radius: 8px; }
.btn { display: inline-block; margin-top: 20px; padding: 10px 20px; background: #35495e; color: white; text-decoration: none; border-radius: 4px; }
</style>