<script setup>
import { ref, watch, watchEffect, computed } from 'vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
])
const searchQuery = ref('')
const selectedCityInfo = ref('')
const logTarget = ref('')
const logMessage = ref('')

const filteredWeatherList = computed(() => {
  const query = searchQuery.value

  if (!query) {
    return weatherList.value
  }

  return weatherList.value.filter((weather) => {
    return weather.name.includes(query)
  })
})
const selectCity = (cityName) => {
  selectedCityInfo.value = `${cityName}이 선택되었습니다.`
}
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

watch(
  () => selectedCityInfo.value,
  (newVal, oldVal) => {
    logTarget.value = `[watch 감지] 상태 바 문구가 없데이트 되었습니다 -> ${oldVal} -> ${newVal}`
  },
)

watchEffect(() => {
  logMessage.value = `[watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링 합니다.`
  console.log(logMessage.value)
})
</script>

<template>
  <div class="practice-container">
    <div class="practice-section">
      <h2>과제 1: 날씨 (Mockup)</h2>
      <hr />
      <div>
        <h3>도시 검색</h3>
        <input type="text" v-model.trim.lazy="searchQuery" placeholder="검색할 도시 이름 입력" />
        <p>검색 중인 도시: {{ searchQuery }}</p>
      </div>
      <div>
        <h3>지역별 날씨 현황</h3>
        <div
          @click="selectCity(item.name)"
          v-for="item in filteredWeatherList"
          :key="item.id"
          class="weather-card"
        >
          <div class="weather-item">
            <div class="weather-header">
              <span>{{ item.name }} ({{ item.status }})</span>

              <button class="btn-detail" @click.stop="showDetail(item.name, item.status)">
                상세보기
              </button>
            </div>

            <p>현재 기온: {{ item.temp }}</p>
            <p v-if="item.temp >= 25" class="weather-hot">더움 (25도 이상)</p>
            <p v-else class="weather-cold">선선함 (25도 미만)</p>
          </div>
        </div>
        <div v-if="filteredWeatherList.length === 0">
          <p>검색 결과 일치하는 도시가 없습니다.</p>
        </div>
        <div class="status-bar">
          {{ selectedCityInfo || '선택된 도시가 없습니다.' }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/challenge.css';
@import '@/assets/practice.css';
</style>
