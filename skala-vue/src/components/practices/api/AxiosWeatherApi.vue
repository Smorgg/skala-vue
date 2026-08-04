<script setup>
import { ref } from 'vue'
import axios from 'axios'

const weatherData = ref(null)
const isLoading = ref(false)

const handleFetchWeather = async () => {
  isLoading.value = true

  const API_KEY = '838916097d27b636734a99199c34302d'
  const URL = `https://api.openweathermap.org/data/2.5/weather?lat=35.158582&lon=126.804975&appid=${API_KEY}&units=metric&lang=kr`

  try {
    const response = await axios.get(URL)
    console.log('Axios 통신 응답 전체 객체:', response)
    console.log('백엔드가 준 핵심 날씨 데이터(JSON):', response.data)
    weatherData.value = response.data
  } catch (error) {
    console.error('통신 중 에러가 발생했습니다:', error)
    alert('데이터를 가져오지 못했습니다. API 키 활성화 여부나 주솔르 확인하세요.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="practice-section">
    <button @click="handleFetchWeather" :disabled="isLoading">
      {{ isLoading ? '데이터 로딩 중...' : '실시간 날씨 데이터 당겨오기' }}
    </button>
    <div v-if="weatherData">
      <p>위치: {{ weatherData.name }}</p>
      <p>현재 기온: {{ weatherData.main.temp }}</p>
      <p>날씨 상태: {{ weatherData.weather[0].description }}</p>
      <p>습도: {{ weatherData.main.humidity }}</p>
    </div>
    <div v-else>
      <p>아직 가져온 데이터가 없습니다. 버튼을 눌러 통신을 가동하세요.</p>
    </div>
  </div>
</template>
