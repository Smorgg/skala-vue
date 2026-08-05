<script setup>
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import SearchBar from '@/components/exercise/SearchBar.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'

const route = useRoute()
const router = useRouter()

const weatherList = ref([])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const isLoading = ref(false)

const API_KEY = '838916097d27b636734a99199c34302d'
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

const fetchRealTimeWeather = async () => {
  isLoading.value = true
  try {
    const [seoulRes, suwonRes, busanRes] = await Promise.all([
      axios.get(`${BASE_URL}?q=Seoul&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Suwon&appid=${API_KEY}&units=metric&lang=kr`),
      axios.get(`${BASE_URL}?q=Busan&appid=${API_KEY}&units=metric&lang=kr`),
    ])

    weatherList.value = [
      {
        id: 'city_01',
        name: '서울',
        temp: seoulRes.data.main.temp,
        status: seoulRes.data.weather[0].description,
      },
      {
        id: 'city_02',
        name: '수원',
        temp: suwonRes.data.main.temp,
        status: suwonRes.data.weather[0].description,
      },
      {
        id: 'city_03',
        name: '부산',
        temp: busanRes.data.main.temp,
        status: busanRes.data.weather[0].description,
      },
    ]
    console.log('[API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화: ', weatherList.value)
  } catch (error) {
    console.error('날씨 API 연동 실패: ', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (route.query.searchQuery) {
    searchQuery.value = route.query.search
  }
  fetchRealTimeWeather()
})

watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

const filteredWeatherList = computed(() => {
  const query = searchQuery.value.trim()
  if (!query) return weatherList.value
  return weatherList.value.filter((item) => item.name.includes(query))
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

watchEffect(() => {
  console.log(
    `🤖 [watchEffect 자동 호출] 현재 검색어 '${searchQuery.value}'에 매칭되는 API 데이터를 필터링합니다.`,
  )
})

const handleWeatherDetail = (id) => {
  router.push(`/weather/${id}`)
}
</script>

<template>
  <!-- slot은 자식 컴포넌트의 특정 영역을 부모가 구성 -->
  <v-container class="pa-0" max-width="600">
    <BaseDashboardCard>
      <SearchBar :current-query="searchQuery" @update-query="(val) => (searchQuery = val)" />
    </BaseDashboardCard>

    <BaseDashboardCard>
      <h3 class="mb-3 text-h6 font-weight-bold">🏙️ 지역별 날씨 현황</h3>
      <!-- 카드 선택 여부도 WeatherCard 컴포넌트에서 처리하기 때문데 selectedCityInfo또한 WeatherCard에서 처리하고 표시만 부모 컴포넌트에서 -->
      <v-alert v-if="isLoading" color="info" icon="mdi-satellite-uplink" variant="tonal">
        글로벌 기상 위성으로부터 실시간 기상 데이터를 수신 중입니다.
        <v-progress-linear class="mt-3" color="info" indeterminate />
      </v-alert>
      <template v-else>
        <WeatherCard
          v-for="item in filteredWeatherList"
          :key="item.id"
          :city-item="item"
          @select-card="(msg) => (selectedCityInfo = msg)"
          @click-detail="handleWeatherDetail(item.id)"
        />
      </template>
      <v-alert
        v-if="filteredWeatherList.length === 0"
        class="mt-3"
        color="error"
        icon="mdi-map-marker-off-outline"
        variant="tonal"
      >
        검색 결과와 일치하는 도시가 없습니다.
      </v-alert>
    </BaseDashboardCard>

    <v-alert color="success" icon="mdi-information-outline" variant="tonal">
      {{ selectedCityInfo }}
    </v-alert>
  </v-container>
</template>
