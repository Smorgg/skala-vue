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
  <v-container class="pa-0" max-width="600">
    <v-card elevation="2" rounded="xl">
      <v-card-title class="pa-5">지역별 상세 기상 관측 정보</v-card-title>
      <v-divider />

      <v-card-text v-if="cityData" class="pa-5">
        <h4 class="mb-3 text-h6">지정 지역: {{ cityData.name }}</h4>
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

      <v-card-actions class="pa-5 pt-0">
        <v-btn
          block
          color="primary"
          prepend-icon="mdi-arrow-left"
          variant="tonal"
          @click="router.push('/')"
        >
          메인 대시보드로 돌아가기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
