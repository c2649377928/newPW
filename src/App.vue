<script setup lang="ts">
import { RouterView } from 'vue-router';
import ThemeToggle from './components/ThemeToggle.vue';
import ScrollProgress from './components/ScrollProgress.vue';
</script>

<template>
  <div class="app-container">
    <ThemeToggle />
    <ScrollProgress />
    <RouterView />
  </div>
</template>

<style>
@import './assets/main.css';

/* 深色模式样式 */
:root[data-theme="dark"] {
  --primary-color: #fff;
  --secondary-color: #000;
  --accent-color: #ddd;
  --text-color: #f5f5f5;
  --background-color: #121212;
}

.app-container {
  width: 100%;
  height: 100%;
  position: relative;
  overflow-x: hidden;
}
</style>