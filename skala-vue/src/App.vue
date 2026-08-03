<script setup>
import PracTwo from './components/practices/composition/PracTwo.vue';
import ReactiveWatch from './components/practices/composition/ReactiveWatch.vue'
import ReactiveMuiltiwatch from './components/practices/composition/ReactiveMuiltiwatch.vue'
import ReactiveDeepwatch from './components/practices/composition/ReactiveDeepwatch.vue'
import PropsEmitsParent from './components/practices/component/PropsEmitsParent.vue'
</script>

<template>
  <div class="practice-container">
    <PracTwo></PracTwo>
    <ReactiveWatch></ReactiveWatch>
    <ReactiveMuiltiwatch></ReactiveMuiltiwatch>
    <ReactiveDeepwatch></ReactiveDeepwatch>
    <PropsEmitsParent></PropsEmitsParent>
  </div>
</template>

<style>
@import '@/assets/practice.css';
</style>
