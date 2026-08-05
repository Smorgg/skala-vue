<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useConfigStore } from '@/stores/configStore'
import CitySearchPanel from '@/components/exercise/CitySearchPanel.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityData = ref(null)
const isLoading = ref(false)
const forecastList = ref([])
const isForecastLoading = ref(false)
const forecastError = ref('')
const searchQuery = ref('')

const API_KEY = '838916097d27b636734a99199c34302d'
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5'

const cityMapping = {
  city_01: { english: 'Seoul', korean: '서울' },
  city_02: { english: 'Suwon', korean: '수원' },
  city_03: { english: 'Busan', korean: '부산' },
}

const fetchForecast = async (targetCity) => {
  isForecastLoading.value = true
  forecastError.value = ''

  try {
    const response = await axios.get(`${WEATHER_BASE_URL}/forecast`, {
      params: {
        q: targetCity.english,
        appid: API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    const timezoneOffset = response.data.city.timezone ?? 0
    const dailyForecasts = new Map()

    response.data.list.forEach((item) => {
      const localDate = new Date((item.dt + timezoneOffset) * 1000)
      const dateKey = localDate.toISOString().slice(0, 10)
      const localHour = localDate.getUTCHours()

      if (!dailyForecasts.has(dateKey)) {
        dailyForecasts.set(dateKey, {
          date: dateKey,
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          status: item.weather[0].description,
          condition: item.weather[0].main,
          precipitation: item.pop ?? 0,
          representativeDistance: Math.abs(localHour - 12),
        })
        return
      }

      const daily = dailyForecasts.get(dateKey)
      daily.minTemp = Math.min(daily.minTemp, item.main.temp_min)
      daily.maxTemp = Math.max(daily.maxTemp, item.main.temp_max)
      daily.precipitation = Math.max(daily.precipitation, item.pop ?? 0)

      const distanceFromNoon = Math.abs(localHour - 12)
      if (distanceFromNoon < daily.representativeDistance) {
        daily.status = item.weather[0].description
        daily.condition = item.weather[0].main
        daily.representativeDistance = distanceFromNoon
      }
    })

    forecastList.value = Array.from(dailyForecasts.values()).slice(0, 5)
  } catch (error) {
    console.error('5일 예보 로딩 중 네트워크 에러 발생: ', error)
    forecastError.value = '예상 날씨 정보를 불러오지 못했습니다.'
  } finally {
    isForecastLoading.value = false
  }
}

onMounted(async () => {
  const id = route.params.cityId
  const targetCity = cityMapping[id] ?? {
    english: id,
    korean: route.query.name || id,
  }

  if (targetCity) {
    fetchForecast(targetCity)
    isLoading.value = true

    try {
      const response = await axios.get(
        `${WEATHER_BASE_URL}/weather?q=${targetCity.english}&appid=${API_KEY}&units=metric&lang=kr`,
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

const displayForecastList = computed(() =>
  forecastList.value.map((item) => ({
    ...item,
    minTemp:
      configStore.unit === 'fahrenheit'
        ? Math.round((item.minTemp * 9) / 5 + 32)
        : Math.round(item.minTemp),
    maxTemp:
      configStore.unit === 'fahrenheit'
        ? Math.round((item.maxTemp * 9) / 5 + 32)
        : Math.round(item.maxTemp),
    precipitation: Math.round(item.precipitation * 100),
  })),
)

const formatForecastDate = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))

const getWeatherIcon = (condition) => {
  const normalizedCondition = condition.toLowerCase()
  if (normalizedCondition.includes('clear')) return 'mdi-weather-sunny'
  if (normalizedCondition.includes('cloud')) return 'mdi-weather-cloudy'
  if (normalizedCondition.includes('rain') || normalizedCondition.includes('drizzle')) {
    return 'mdi-weather-rainy'
  }
  if (normalizedCondition.includes('thunder')) return 'mdi-weather-lightning-rainy'
  if (normalizedCondition.includes('snow')) return 'mdi-weather-snowy'
  return 'mdi-weather-fog'
}

const handleSearch = () => {
  router.push({
    name: 'WeatherHome',
    query: { search: searchQuery.value.trim() || undefined },
  })
}
</script>

<template>
  <v-container class="pa-0" max-width="1400">
    <CitySearchPanel
      :current-query="searchQuery"
      @search="handleSearch"
      @update-query="(val) => (searchQuery = val)"
    />

    <v-row align="stretch">
      <v-col class="d-flex" cols="12" md="5">
        <v-card class="flex-grow-1" elevation="2" rounded="xl">
          <v-card-title class="pa-5">현재 날씨</v-card-title>
          <v-divider />

          <v-card-text v-if="isLoading" class="pa-5">
            <v-alert color="info" icon="mdi-satellite-uplink" variant="tonal">
              상세 기상 정보를 불러오는 중입니다.
              <v-progress-linear class="mt-3" color="info" indeterminate />
            </v-alert>
          </v-card-text>

          <v-card-text v-else-if="cityData" class="pa-5">
            <h2 class="mb-3 text-h6">{{ cityData.name }}</h2>
            <v-list bg-color="transparent">
              <v-list-item
                prepend-icon="mdi-thermometer"
                :subtitle="`${displayTemp}${configStore.unitSymbol}`"
                title="실시간 기온"
              />
              <v-list-item
                prepend-icon="mdi-weather-cloudy"
                :subtitle="cityData.status"
                title="기상 현황"
              />
              <v-list-item
                prepend-icon="mdi-water-percent"
                :subtitle="cityData.humidity"
                title="대기 습도"
              />
              <v-list-item
                prepend-icon="mdi-weather-windy"
                :subtitle="cityData.wind"
                title="현재 풍속"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="d-flex" cols="12" md="7">
        <v-card class="flex-grow-1" elevation="2" rounded="xl">
          <v-card-title class="pa-5">5일 예상 날씨</v-card-title>
          <v-divider />

          <v-card-text v-if="isForecastLoading" class="pa-5">
            <v-alert color="info" icon="mdi-calendar-clock" variant="tonal">
              5일 예상 날씨를 불러오는 중입니다.
              <v-progress-linear class="mt-3" color="info" indeterminate />
            </v-alert>
          </v-card-text>

          <v-card-text v-else-if="forecastError" class="pa-5">
            <v-alert color="error" icon="mdi-weather-cloudy-alert" variant="tonal">
              {{ forecastError }}
            </v-alert>
          </v-card-text>

          <v-list v-else class="px-3 pb-3" bg-color="transparent" lines="two">
            <template v-for="(forecast, index) in displayForecastList" :key="forecast.date">
              <v-list-item
                :prepend-icon="getWeatherIcon(forecast.condition)"
                :subtitle="`${forecast.status} · 최저 ${forecast.minTemp}${configStore.unitSymbol} / 최고 ${forecast.maxTemp}${configStore.unitSymbol}`"
                :title="formatForecastDate(forecast.date)"
              >
                <template #append>
                  <v-chip
                    color="info"
                    prepend-icon="mdi-water-percent"
                    size="small"
                    variant="tonal"
                  >
                    {{ forecast.precipitation }}%
                  </v-chip>
                </template>
              </v-list-item>
              <v-divider v-if="index < displayForecastList.length - 1" inset />
            </template>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <v-btn
      block
      class="mt-4"
      color="primary"
      prepend-icon="mdi-arrow-left"
      size="large"
      variant="tonal"
      @click="router.push('/')"
    >
      메인 대시보드로 돌아가기
    </v-btn>
  </v-container>
</template>
