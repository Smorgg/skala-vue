<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

import CitySearchPanel from '@/components/exercise/CitySearchPanel.vue'
import WeatherMap from '@/components/exercise/WeatherMap.vue'
import { useConfigStore } from '@/stores/configStore'
import { useSearchHistoryStore } from '@/stores/searchHistoryStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()
const searchHistoryStore = useSearchHistoryStore()

const locations = ref([])
const searchQuery = ref('')
const isLoading = ref(false)
const searchError = ref('')
const lastUpdated = ref(null)

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

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

const updatedLabel = computed(() => {
  if (!lastUpdated.value) return '관측 정보 연결 전'
  return `${new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(lastUpdated.value)} 업데이트`
})

const displayTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') return Math.round((temperature * 9) / 5 + 32)
  return Math.round(temperature)
}

const fetchCityWeather = async (searchTerm) => {
  const koreanCityName = searchTerm.replace(/(특별자치시|특별시|광역시|시)$/u, '')
  const apiQuery = koreanCityQueries[koreanCityName] || searchTerm
  const response = await axios.get(BASE_URL, {
    params: {
      q: apiQuery,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  const raw = response.data

  return {
    id: raw.id,
    query: apiQuery,
    searchTerm,
    name: koreanCityQueries[koreanCityName] ? koreanCityName : raw.name,
    temp: raw.main.temp,
    feelsLike: raw.main.feels_like,
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    windSpeed: raw.wind.speed,
    status: raw.weather[0].description,
    condition: raw.weather[0].main,
    lat: raw.coord.lat,
    lon: raw.coord.lon,
  }
}

const fetchCoordinateWeather = async ({ lat, lon }) => {
  const response = await axios.get(BASE_URL, {
    params: {
      lat,
      lon,
      appid: OPENWEATHER_API_KEY,
      units: 'metric',
      lang: 'kr',
    },
  })
  const raw = response.data
  const coordinateLabel = `${lat.toFixed(3)}, ${lon.toFixed(3)}`

  return {
    id: `coordinate-${lat}-${lon}`,
    query: raw.name || '',
    searchTerm: raw.name || coordinateLabel,
    name: raw.name || `선택 위치 (${coordinateLabel})`,
    temp: raw.main.temp,
    feelsLike: raw.main.feels_like,
    humidity: raw.main.humidity,
    pressure: raw.main.pressure,
    windSpeed: raw.wind.speed,
    status: raw.weather[0].description,
    condition: raw.weather[0].main,
    lat,
    lon,
    preserveView: true,
  }
}

const loadWeather = async (query = '') => {
  const normalizedQuery = query.trim()
  searchError.value = ''

  if (!normalizedQuery) {
    locations.value = []
    lastUpdated.value = null
    await router.replace({ path: '/map' })
    return true
  }

  if (!OPENWEATHER_API_KEY) {
    searchError.value = 'OpenWeather API 키를 설정하면 실시간 관측 정보를 확인할 수 있습니다.'
    return false
  }

  isLoading.value = true
  try {
    locations.value = [await fetchCityWeather(normalizedQuery)]
    lastUpdated.value = new Date()

    searchHistoryStore.addRecentSearch(normalizedQuery)
    await router.replace({
      path: '/map',
      query: { search: normalizedQuery },
    })
    return true
  } catch (error) {
    console.error('기상 지도 관측 정보 연동 실패:', error)
    searchError.value =
      error.response?.status === 404
        ? '도시를 찾을 수 없습니다. 도시 이름을 다시 확인해 주세요.'
        : '실시간 관측 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'
    return false
  } finally {
    isLoading.value = false
  }
}

const handleSearch = async (query = searchQuery.value) => {
  const normalizedQuery = typeof query === 'string' ? query.trim() : ''
  searchQuery.value = normalizedQuery
  await loadWeather(normalizedQuery)
}

const handleMapLocationSelect = async (coordinates) => {
  if (isLoading.value) return
  searchError.value = ''

  if (!OPENWEATHER_API_KEY) {
    searchError.value = 'OpenWeather API 키를 설정하면 선택한 위치의 날씨를 확인할 수 있습니다.'
    return
  }

  isLoading.value = true
  try {
    locations.value = [await fetchCoordinateWeather(coordinates)]
    searchQuery.value = ''
    lastUpdated.value = new Date()
    await router.replace({ path: '/map' })
  } catch (error) {
    console.error('선택 위치의 기상 정보 연동 실패:', error)
    searchError.value = '선택한 위치의 기상 정보를 불러오지 못했습니다. 다시 시도해 주세요.'
  } finally {
    isLoading.value = false
  }
}

const openWeatherDetail = (location) => {
  router.push({
    name: 'WeatherDetail',
    params: { cityId: location.query },
    query: { name: location.name },
  })
}

onMounted(() => {
  const initialQuery = typeof route.query.search === 'string' ? route.query.search.trim() : ''
  searchQuery.value = initialQuery
  if (initialQuery) loadWeather(initialQuery)
})
</script>

<template>
  <v-container class="pa-0" max-width="1200">
    <section
      class="map-hero mb-5 d-flex flex-column flex-md-row align-md-end justify-space-between ga-4"
    >
      <div>
        <div class="mb-2 d-flex align-center ga-2 text-overline text-primary font-weight-bold">
          <v-icon icon="mdi-access-point" size="small" />
          LIVE WEATHER MAP
        </div>
        <h2 class="map-page-title font-weight-bold">실시간 기상 지도</h2>
        <p class="mt-2 mb-0 text-body-1 text-medium-emphasis">
          강수·구름·기온·바람·기압의 흐름을 지도에서 한눈에 살펴보세요.
        </p>
      </div>

      <v-chip
        class="align-self-start align-self-md-end"
        color="success"
        prepend-icon="mdi-circle-medium"
        variant="tonal"
      >
        {{ updatedLabel }}
      </v-chip>
    </section>

    <CitySearchPanel
      :current-query="searchQuery"
      @search="handleSearch"
      @update-query="(value) => (searchQuery = value)"
    />

    <v-alert
      v-if="searchError"
      class="mb-4"
      color="error"
      icon="mdi-map-marker-off-outline"
      variant="tonal"
    >
      {{ searchError }}
    </v-alert>

    <WeatherMap
      expanded
      :loading="isLoading"
      :locations="locations"
      selectable
      @select-location="handleMapLocationSelect"
      @view-detail="openWeatherDetail"
    />

    <section v-if="locations.length" aria-labelledby="observations-title">
      <div class="mb-3 d-flex align-center justify-space-between ga-3">
        <h3 id="observations-title" class="text-h6 font-weight-bold">지도 위 관측 지점</h3>
        <span class="text-caption text-medium-emphasis"
          >온도 단위 {{ configStore.unitSymbol }}</span
        >
      </div>

      <v-slide-group show-arrows>
        <v-slide-group-item v-for="location in locations" :key="location.id">
          <v-card class="observation-card mr-3" color="surface" rounded="xl" variant="outlined">
            <v-card-text class="pa-4">
              <div class="d-flex align-start justify-space-between ga-4">
                <div>
                  <div class="text-subtitle-1 font-weight-bold">{{ location.name }}</div>
                  <div class="text-caption text-medium-emphasis">{{ location.status }}</div>
                </div>
                <div class="temperature font-weight-bold">
                  {{ displayTemperature(location.temp) }}{{ configStore.unitSymbol }}
                </div>
              </div>

              <div class="mt-4 d-flex flex-wrap ga-2">
                <v-chip prepend-icon="mdi-water-percent" size="small" variant="tonal">
                  {{ location.humidity }}%
                </v-chip>
                <v-chip prepend-icon="mdi-weather-windy" size="small" variant="tonal">
                  {{ location.windSpeed }} m/s
                </v-chip>
                <v-chip prepend-icon="mdi-gauge" size="small" variant="tonal">
                  {{ location.pressure }} hPa
                </v-chip>
              </div>

              <v-btn
                v-if="location.query"
                class="mt-4 px-0"
                color="primary"
                append-icon="mdi-arrow-right"
                variant="text"
                @click="openWeatherDetail(location)"
              >
                상세 예보 보기
              </v-btn>
            </v-card-text>
          </v-card>
        </v-slide-group-item>
      </v-slide-group>
    </section>
  </v-container>
</template>

<style scoped>
.map-hero {
  padding: 8px 4px 0;
}

.map-page-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  line-height: 1.05;
  letter-spacing: -0.045em;
}

.observation-card {
  width: 320px;
  border-color: rgba(var(--v-theme-on-surface), 0.12);
}

.temperature {
  color: rgb(var(--v-theme-primary));
  font-size: 1.75rem;
  line-height: 1;
  letter-spacing: -0.04em;
}

@media (max-width: 599px) {
  .observation-card {
    width: min(290px, calc(100vw - 56px));
  }
}
</style>
