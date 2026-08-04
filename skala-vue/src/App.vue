<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app-container">
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/">WeatherHome</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about">서비스 소개</RouterLink>
        <RouterLink to="/1">오류</RouterLink>
      </nav>
    </div>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
@import '@/assets/exercise.css';
</style>
