<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="nav-unit-toggle">
    <span
      >날씨단위: {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }} ({{
        configStore.unitSymbol
      }})</span
    >
    <button @click="configStore.toggleUnit" class="btn-unit-change">단위변경</button>
  </div>
</template>

<style scoped>
.nav-unit-toggle {
  text-align: center;
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.btn-unit-change {
  width: 80px;
  align-items: center;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
