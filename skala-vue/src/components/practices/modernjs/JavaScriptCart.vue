<script setup>
import { ref } from 'vue'

const result2 = ref('')

const runTask2 = () => {
  const currentCart = ['Apple', 'Banana']
  const newProduct = { name: 'Orange', stock: 0, preview: null }

  const updatedCart = [...currentCart, newProduct.name]
  const imgStatus = newProduct?.preview ?? '이미지 준비중'
  const finalStock = newProduct.stock ?? 10

  result2.value = `카트: ${updatedCart} / 이미지: ${imgStatus} / 수량: ${finalStock}`
}
</script>

<template>
  <div class="quiz-container">
    <div class="card">
      <h3>과제 2. 불변성 복사 및 데이터 방어</h3>
      <button @click="runTask2">과제 2 가동</button>
      <div class="console">결과창 2: {{ result2 }}</div>
    </div>
  </div>
</template>
