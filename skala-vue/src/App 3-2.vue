<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <div class="dashboard-wrapper">
      <nav class="navigation-bar">
        <RouterLink to="/">WeatherHome</RouterLink>
        <span class="divider">|</span>
        <RouterLink to="/about">서비스 소개</RouterLink>
        <UnitToggler></UnitToggler>
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
