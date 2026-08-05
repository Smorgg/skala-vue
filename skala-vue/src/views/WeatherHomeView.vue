<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import BaseDashboardCard from '@/components/exercise/BaseDashboardCard.vue'
import CitySearchPanel from '@/components/exercise/CitySearchPanel.vue'
import WeatherCard from '@/components/exercise/WeatherCard.vue'
import WeatherMap from '@/components/exercise/WeatherMap.vue'
import { useSearchHistoryStore } from '@/stores/searchHistoryStore'

const route = useRoute()
const router = useRouter()
const searchHistoryStore = useSearchHistoryStore()

const weatherList = ref([])
const searchQuery = ref('')
const selectedCityInfo = ref('카드를 클릭하거나 검색해 보세요.')
const isLoading = ref(false)
const searchError = ref('')

// 빌드 환경 테스트용
const API_URL = import.meta.env.VITE_API_URL

// OpenWeather API
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

// 한국 도시 이름 맵핑
const koreanCityQueries = {
  서울: 'Seoul,KR',
  부산: 'Busan,KR',
  인천: 'Incheon,KR',
  대구: 'Daegu,KR',
  대전: 'Daejeon,KR',
  광주: 'Gwangju,KR',
  울산: 'Ulsan,KR',
  수원: 'Suwon,KR',
  세종: 'Sejong,KR',
  제주: 'Jeju City,KR',
  춘천: 'Chuncheon,KR',
  강릉: 'Gangneung,KR',
  전주: 'Jeonju,KR',
  창원: 'Changwon,KR',
  포항: 'Pohang,KR',
}

// 현재 날씨 정보 불러오기
const fetchRealTimeWeather = async (city = '') => {
  isLoading.value = true
  searchError.value = ''
  try {
    const searchTerms = city.trim() ? [city.trim()] : ['서울', '부산', '인천']

    weatherList.value = await Promise.all(
      searchTerms.map(async (searchTerm) => {
        const koreanCityName = searchTerm.replace(/(특별자치시|특별시|광역시|시)$/u, '')
        const apiQuery = koreanCityQueries[koreanCityName] || searchTerm
        const response = await axios.get(
          `${BASE_URL}?q=${encodeURIComponent(apiQuery)}&appid=${OPENWEATHER_API_KEY}&units=metric&lang=kr`,
        )
        const raw = response.data

        return {
          id: raw.id,
          query: apiQuery,
          searchTerm,
          name: koreanCityQueries[koreanCityName] ? koreanCityName : raw.name,
          temp: raw.main.temp,
          status: raw.weather[0].description,
          condition: raw.weather[0].main,
          lat: raw.coord.lat,
          lon: raw.coord.lon,
        }
      }),
    )
    if (city.trim()) searchHistoryStore.addRecentSearch(city)
    console.log('[API 통신 완료] 메인 대시보드 실시간 기상 장부 동기화: ', weatherList.value)
  } catch (error) {
    console.error('날씨 API 연동 실패: ', error)
    searchError.value =
      error.response?.status === 404
        ? '도시를 찾을 수 없습니다. 도시 이름을 다시 확인해 주세요.'
        : '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // 빌드 환경 테스트 용
  console.log(`${API_URL}`)
  const initialQuery = typeof route.query.search === 'string' ? route.query.search.trim() : ''
  searchQuery.value = initialQuery
  fetchRealTimeWeather(initialQuery)
})

watch(searchQuery, (newQuery) => {
  router.push({
    path: route.path,
    query: { search: newQuery || undefined },
  })
})

watch(selectedCityInfo, (newInfo) => {
  console.log(`👁️‍🗨️ [watch 감지] 상태 바 문구가 업데이트되었습니다 -> "${newInfo}"`)
})

const visibleWeatherList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return weatherList.value
  return weatherList.value.filter(
    (item) => item.searchTerm.toLowerCase() === query || item.query.toLowerCase() === query,
  )
})

const handleSearch = (query = searchQuery.value) => {
  const normalizedQuery = typeof query === 'string' ? query.trim() : searchQuery.value.trim()
  searchQuery.value = normalizedQuery
  fetchRealTimeWeather(normalizedQuery)
}

const handleWeatherDetail = (item) => {
  router.push({
    name: 'WeatherDetail',
    params: { cityId: item.query },
    query: { name: item.name },
  })
}
</script>

<template>
  <!-- slot은 자식 컴포넌트의 특정 영역을 부모가 구성 -->
  <v-container class="pa-0" max-width="1200">
    <CitySearchPanel
      :current-query="searchQuery"
      @search="handleSearch"
      @update-query="(val) => (searchQuery = val)"
    />

    <BaseDashboardCard>
      <div class="mb-4 d-flex align-center ga-2">
        <v-icon color="primary" icon="mdi-city-variant-outline" />
        <h2 class="text-h6 font-weight-bold">지역별 날씨 현황</h2>
      </div>
      <!-- 카드 선택 여부도 WeatherCard 컴포넌트에서 처리하기 때문데 selectedCityInfo또한 WeatherCard에서 처리하고 표시만 부모 컴포넌트에서 -->
      <v-alert v-if="isLoading" color="info" icon="mdi-satellite-uplink" variant="tonal">
        글로벌 기상 위성으로부터 실시간 기상 데이터를 수신 중입니다.
        <v-progress-linear class="mt-3" color="info" indeterminate />
      </v-alert>
      <v-row v-else class="weather-grid" density="comfortable">
        <v-col v-for="item in visibleWeatherList" :key="item.id" cols="12" lg="4" sm="6">
          <WeatherCard
            class="h-100"
            :city-item="item"
            @select-card="(msg) => (selectedCityInfo = msg)"
            @click-detail="handleWeatherDetail(item)"
          />
        </v-col>
      </v-row>
      <v-alert
        v-if="searchError"
        class="mt-3"
        color="error"
        icon="mdi-map-marker-off-outline"
        variant="tonal"
      >
        {{ searchError }}
      </v-alert>
    </BaseDashboardCard>

    <WeatherMap :loading="isLoading" :locations="weatherList" @view-detail="handleWeatherDetail" />

    <v-alert color="info" icon="mdi-information-outline" variant="tonal">
      {{ selectedCityInfo }}
    </v-alert>
  </v-container>
</template>
