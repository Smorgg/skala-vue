<script setup>
import { RouterView } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <v-app>
    <v-main class="bg-background">
      <v-container class="py-8" max-width="900">
        <h1 class="mb-4 text-h4 font-weight-bold">종합실습 5: 스토어 적용</h1>

        <v-sheet class="mx-auto mb-6" color="transparent" max-width="600" width="100%">
          <v-toolbar class="px-2" color="surface" elevation="2" rounded="lg">
            <v-btn color="primary" to="/" variant="text">날씨 대시보드</v-btn>
            <v-divider class="mx-2 my-3 ga-5" vertical />
            <v-btn color="primary" to="/about" variant="text">서비스 소개</v-btn>
            <v-spacer />
            <UnitToggler />
          </v-toolbar>
        </v-sheet>

        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>
