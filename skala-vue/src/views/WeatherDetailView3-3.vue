<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const isLoading = ref(false)

const cityMapping = {
  city_01: { english: 'Seoul', korean: '서울' },
  city_02: { english: 'Suwon', korean: '수원' },
  city_03: { english: 'Busan', korean: '부산' },
}

onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id]

  if (targetCity) {
    isLoading.value = true

    try {
      const API_KEY = '838916097d27b636734a99199c34302d'
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`,
      )

      const raw = response.data
      cityData.value = {
        name: targetCity.korean,
        temp: raw.main.temp,
        status: raw.weather[0].description,
        humidity: `${raw.main.humidity}%`,
        wind: `${raw.wind.speed}m/s`,
      }
    } catch (error) {
      console.error('상세 정보 로딩 중 네트워크 에러 발행: ', error)
    } finally {
      isLoading.value = false
    }
  }
})

const displayTemp = computed(() => {
  if (!cityData.value) return 0
  const rawTemp = cityData.value.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <div>
    <h3>지역별 상세 기상 관측 정보</h3>
    <hr />
    <div v-if="cityData">
      <h4>지정 지역: {{ cityData.name }}</h4>
      <p>실시간 기온: {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
    </div>
    <button @click="router.push('/')" class="btn-home">매인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
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
