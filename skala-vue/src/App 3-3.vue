<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="app-container">
    <div class="dashboard-wrapper">
      <h1>종합실습 5: 스토어 적용</h1>
      <nav class="navigation-bar">
        <RouterLink to="/">날씨 대시보드</RouterLink>
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
