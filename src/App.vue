<script setup>
import { RouterView } from 'vue-router'

</script>

<template>
  <RouterView />
</template>

<style>
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: #f8f9fa; 
}

*,
*::before,
*::after {
  box-sizing: border-box;
}


#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh; 
}
</style>