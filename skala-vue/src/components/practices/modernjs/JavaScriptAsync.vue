<script setup>
import { ref } from 'vue'

const result3 = ref('')

const fetchUserId = () => new Promise(res => setTimeout(() => res({uid: 777})), 400)
const fetchUserProfile = (uid) => new Promise(res => setTimeout(() => res({uid, nick: 'Graves'}), 400))

const runTask3 = async () => {
  result3.value = '데이터 동기화 중...'

  try {
    const {uid} = await fetchUserId()
    const {nick} = await fetchUserProfile(uid)

    result3.value = `동기화 성공: ${nick}님 환영합니다.`
  } catch (error) {
    result3.value = '통신 실패'
  }
}
</script>

<template>
  <div class="quiz-container">
    <div class="card">
      <h3>과제 3. 비동기 연쇄 파이프라인 (Async/Await)</h3>
      <button @click="runTask3">과제 3 가동</button>
      <div class="console">결과창 3: {{ result3 }}</div>
    </div>
  </div>
</template>
