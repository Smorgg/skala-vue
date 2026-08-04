<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <button @click="router.push('/')" class="btn-home">매인 대시보드로 돌아가기</button>
</template>

<style>
.btn-home {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
