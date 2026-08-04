<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

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
</script>

<template>
  <div>
    <h3>지역별 상세 기상 관측 정보</h3>
    <hr />
    <div v-if="cityData">
      <h4>지정 지역: {{ cityData.name }}</h4>
      <p>실시간 기온: {{ cityData.temp }}°C</p>
      <p>기상 현황: {{ cityData.status }}</p>
      <p>대기 습도: {{ cityData.humidity }}</p>
      <p>현재 풍속: {{ cityData.wind }}</p>
    </div>
    <button @click="router.push('/')">매인 대시보드로 돌아가기</button>
  </div>
</template>
