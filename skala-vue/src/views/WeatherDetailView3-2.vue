<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityDetails = {
  city_01: { name: '서울', temp: 28, status: '맑음', humidity: '55%', wind: '2.5m/s' },
  city_02: { name: '수원', temp: 24, status: '비', humidity: '90%', wind: '0.5m/s' },
  city_03: { name: '부산', temp: 25, status: '구름', humidity: '60%', wind: '5m/s' },
}

const cityData = ref(null)

onMounted(() => {
  const id = route.params.cityId
  if (cityDetails[id]) {
    cityData.value = cityDetails[id]
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
