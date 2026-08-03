<script setup>
import PracOne from './components/practices/basic/PracOne.vue'
import ReactiveWatch from './components/practices/composition/ReactiveWatch.vue'
import ReactiveMuiltiwatch from './components/practices/composition/ReactiveMuiltiwatch.vue'
import ReactiveDeepwatch from './components/practices/composition/ReactiveDeepwatch.vue'
</script>

<template>
  <div>
    <PracOne></PracOne>
    <ReactiveWatch></ReactiveWatch>
    <ReactiveMuiltiwatch></ReactiveMuiltiwatch>
    <ReactiveDeepwatch></ReactiveDeepwatch>
  </div>
</template>

<style scoped>
@import '@/assets/practice.css';
</style>
