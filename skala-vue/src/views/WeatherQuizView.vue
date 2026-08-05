<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

import { weatherQuizCities } from '@/data/weatherQuizCities'
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()

const currentCity = ref(null)
const previousCityName = ref('')
const weatherDays = ref([])
const answer = ref('')
const hintLevel = ref(0)
const roundScore = ref(100)
const totalScore = ref(0)
const roundNumber = ref(0)
const feedback = ref(null)
const isLoading = ref(false)
const loadError = ref('')
const isRoundComplete = ref(false)

const hintScores = [100, 80, 60, 30, 0]
const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY
const OPENWEATHER_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast'

const weatherIcons = {
  Clear: 'mdi-weather-sunny',
  Clouds: 'mdi-weather-cloudy',
  Rain: 'mdi-weather-rainy',
  Drizzle: 'mdi-weather-partly-rainy',
  Thunderstorm: 'mdi-weather-lightning-rainy',
  Snow: 'mdi-weather-snowy',
  Mist: 'mdi-weather-fog',
  Smoke: 'mdi-weather-fog',
  Haze: 'mdi-weather-hazy',
  Dust: 'mdi-weather-dust',
  Fog: 'mdi-weather-fog',
  Sand: 'mdi-weather-dust',
  Ash: 'mdi-weather-dust',
  Squall: 'mdi-weather-windy',
  Tornado: 'mdi-weather-tornado',
}

const displayedWeatherDays = computed(() =>
  weatherDays.value.map((day) => ({
    ...day,
    minTemp: convertTemperature(day.minTemp),
    maxTemp: convertTemperature(day.maxTemp),
  })),
)

const hints = computed(() => {
  if (!currentCity.value) return []

  return [
    { icon: 'mdi-earth', label: '대륙', value: currentCity.value.continent },
    { icon: 'mdi-flag-outline', label: '국가', value: currentCity.value.country },
    { icon: 'mdi-format-letter-case', label: '이니셜', value: currentCity.value.initials },
    { icon: 'mdi-map-marker', label: '도시', value: currentCity.value.name },
  ].slice(0, hintLevel.value)
})

const nextHintLabel = computed(() => {
  const labels = ['대륙 힌트', '국가 힌트', '이니셜 힌트', '정답 공개']
  return labels[hintLevel.value] || '힌트 모두 사용'
})

const convertTemperature = (temperature) => {
  if (configStore.unit === 'fahrenheit') return Math.round((temperature * 9) / 5 + 32)
  return Math.round(temperature)
}

const formatDate = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'numeric',
    day: 'numeric',
    weekday: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))

const normalizeAnswer = (value) =>
  value
    .trim()
    .toLocaleLowerCase()
    .replace(/[\s._-]/g, '')

const chooseNextCity = () => {
  const candidates = weatherQuizCities.filter((city) => city.name !== previousCityName.value)
  return candidates[Math.floor(Math.random() * candidates.length)]
}

const getWeatherIcon = (condition) => weatherIcons[condition] || 'mdi-weather-cloudy-alert'

const getLocalDateKey = (timestamp, timezoneOffset) =>
  new Date((timestamp + timezoneOffset) * 1000).toISOString().slice(0, 10)

const loadQuizRound = async () => {
  const city = chooseNextCity()
  currentCity.value = city
  previousCityName.value = city.name
  answer.value = ''
  hintLevel.value = 0
  roundScore.value = 100
  feedback.value = null
  loadError.value = ''
  isRoundComplete.value = false
  isLoading.value = true

  try {
    const forecastResponse = await axios.get(OPENWEATHER_FORECAST_URL, {
      params: {
        lat: city.latitude,
        lon: city.longitude,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        lang: 'kr',
      },
    })

    const forecast = forecastResponse.data
    const timezoneOffset = forecast.city.timezone ?? 0
    const dailyForecasts = new Map()

    forecast.list.forEach((item) => {
      const date = getLocalDateKey(item.dt, timezoneOffset)
      const localHour = new Date((item.dt + timezoneOffset) * 1000).getUTCHours()

      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, {
          date,
          minTemp: item.main.temp_min,
          maxTemp: item.main.temp_max,
          precipitation: item.pop ?? 0,
          weather: item.weather[0],
          representativeDistance: Math.abs(localHour - 12),
        })
        return
      }

      const daily = dailyForecasts.get(date)
      daily.minTemp = Math.min(daily.minTemp, item.main.temp_min)
      daily.maxTemp = Math.max(daily.maxTemp, item.main.temp_max)
      daily.precipitation = Math.max(daily.precipitation, item.pop ?? 0)

      const distanceFromNoon = Math.abs(localHour - 12)
      if (distanceFromNoon < daily.representativeDistance) {
        daily.weather = item.weather[0]
        daily.representativeDistance = distanceFromNoon
      }
    })

    const today = getLocalDateKey(Math.floor(Date.now() / 1000), timezoneOffset)
    weatherDays.value = Array.from(dailyForecasts.values())
      .slice(0, 5)
      .map((day) => ({
        date: day.date,
        period: day.date === today ? '오늘' : '예상',
        minTemp: day.minTemp,
        maxTemp: day.maxTemp,
        precipitationLabel: `${Math.round(day.precipitation * 100)}%`,
        weatherLabel: day.weather.description,
        weatherIcon: getWeatherIcon(day.weather.main),
      }))
    roundNumber.value += 1
  } catch (error) {
    console.error('날씨 퀴즈 데이터 로딩 실패: ', error)
    if ([401, 403].includes(error.response?.status)) {
      loadError.value = 'OpenWeather API 키를 확인해 주세요.'
    } else if (error.response?.status === 429) {
      loadError.value = 'OpenWeather API 요청 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.'
    } else {
      loadError.value = 'OpenWeather 날씨 데이터를 불러오지 못했습니다. 다시 시도해 주세요.'
    }
    weatherDays.value = []
  } finally {
    isLoading.value = false
  }
}

const submitAnswer = () => {
  if (!answer.value.trim()) {
    feedback.value = { type: 'warning', message: '도시 이름을 먼저 입력해 주세요.' }
    return
  }

  const acceptedAnswers = [
    currentCity.value.name,
    currentCity.value.englishName,
    ...currentCity.value.aliases,
  ].map(normalizeAnswer)

  if (acceptedAnswers.includes(normalizeAnswer(answer.value))) {
    isRoundComplete.value = true
    totalScore.value += roundScore.value
    feedback.value = {
      type: 'success',
      message: `정답입니다! ${currentCity.value.name}의 날씨였습니다. +${roundScore.value}점`,
    }
    return
  }

  roundScore.value = Math.max(0, roundScore.value - 10)
  feedback.value = {
    type: 'error',
    message: `아쉽지만 정답이 아닙니다. 현재 점수는 ${roundScore.value}점입니다.`,
  }
}

const revealHint = () => {
  if (hintLevel.value >= 4 || isRoundComplete.value) return

  hintLevel.value += 1
  roundScore.value = Math.min(roundScore.value, hintScores[hintLevel.value])
  feedback.value = null

  if (hintLevel.value === 4) {
    isRoundComplete.value = true
    feedback.value = {
      type: 'info',
      message: `정답은 ${currentCity.value.name}였습니다. 다음 문제에 도전해 보세요.`,
    }
  }
}

onMounted(loadQuizRound)
</script>

<template>
  <v-container class="pa-0" max-width="1200">
    <v-card class="quiz-hero mb-4" elevation="2" rounded="xl">
      <v-card-text class="pa-6">
        <div class="d-flex flex-wrap align-center justify-space-between ga-4">
          <div>
            <div class="text-overline text-primary">WEATHER DETECTIVE</div>
            <h2 class="text-h5 font-weight-bold">날씨 추리 퀴즈</h2>
            <p class="mt-2 text-body-2 text-medium-emphasis">
              앞으로 5일의 예상 날씨만 보고 도시를 맞혀보세요.
            </p>
          </div>

          <div class="d-flex ga-2">
            <v-chip color="primary" prepend-icon="mdi-puzzle-outline" variant="tonal">
              {{ roundNumber || 1 }}번째 문제
            </v-chip>
            <v-chip color="success" prepend-icon="mdi-star-outline" variant="tonal">
              총 {{ totalScore }}점
            </v-chip>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <v-card elevation="2" rounded="xl">
      <v-card-title class="d-flex align-center justify-space-between pa-5">
        <span>5일 예상 날씨</span>
        <v-chip color="warning" prepend-icon="mdi-trophy-outline" size="small" variant="tonal">
          현재 {{ roundScore }}점
        </v-chip>
      </v-card-title>
      <v-divider />

      <v-card-text v-if="isLoading" class="pa-6">
        <v-alert color="info" icon="mdi-satellite-uplink" variant="tonal">
          새로운 도시의 날씨 단서를 수집하고 있습니다.
          <v-progress-linear class="mt-3" color="info" indeterminate />
        </v-alert>
      </v-card-text>

      <v-card-text v-else-if="loadError" class="pa-6">
        <v-alert color="error" icon="mdi-cloud-alert" variant="tonal">
          {{ loadError }}
        </v-alert>
        <v-btn block class="mt-4" color="primary" @click="loadQuizRound">다시 시도</v-btn>
      </v-card-text>

      <template v-else>
        <v-card-text class="pa-5">
          <div class="weather-timeline">
            <v-card
              v-for="day in displayedWeatherDays"
              :key="day.date"
              class="weather-day"
              :class="`weather-day--${day.period}`"
              rounded="lg"
              variant="tonal"
            >
              <v-card-text class="pa-3 text-center">
                <v-chip
                  class="mb-2"
                  :color="day.period === '오늘' ? 'primary' : 'info'"
                  size="x-small"
                  variant="flat"
                >
                  {{ day.period }}
                </v-chip>
                <div class="text-caption text-medium-emphasis">{{ formatDate(day.date) }}</div>
                <v-icon class="my-3" color="primary" :icon="day.weatherIcon" size="34" />
                <div class="mb-2 text-body-2 font-weight-medium">{{ day.weatherLabel }}</div>
                <div class="text-caption">
                  {{ day.minTemp }}° / <strong>{{ day.maxTemp }}°</strong>
                </div>
                <div class="mt-1 text-caption text-info">
                  <v-icon icon="mdi-water-percent" size="x-small" />
                  {{ day.precipitationLabel }}
                </div>
              </v-card-text>
            </v-card>
          </div>

          <p class="mt-3 text-caption text-medium-emphasis">
            OpenWeather의 3시간 단위 예보를 날짜별로 묶어 표시합니다.
            <span class="d-sm-none"> 좌우로 넘겨 전체 예보를 확인하세요.</span>
          </p>
        </v-card-text>

        <v-divider />

        <v-card-text class="pa-5">
          <h3 class="mb-4 text-h6 font-weight-bold">이 도시는 어디일까요?</h3>

          <v-text-field
            v-model="answer"
            :disabled="isRoundComplete"
            hide-details
            label="도시 이름"
            placeholder="한글 또는 영문 도시 이름 입력"
            prepend-inner-icon="mdi-map-search-outline"
            variant="outlined"
            @keyup.enter="submitAnswer"
          />

          <div class="mt-3 d-flex ga-2">
            <v-btn
              min-width="130px"
              color="warning"
              :disabled="isRoundComplete || hintLevel >= 4"
              prepend-icon="mdi-lightbulb-outline"
              variant="tonal"
              @click="revealHint"
            >
              {{ nextHintLabel }}
            </v-btn>
            <v-btn
              class="ml-auto"
              color="success"
              :disabled="isRoundComplete"
              prepend-icon="mdi-check-bold"
              @click="submitAnswer"
            >
              정답 확인
            </v-btn>
          </div>

          <div v-if="hints.length" class="mt-4 d-flex flex-column ga-2">
            <v-alert
              v-for="hint in hints"
              :key="hint.label"
              color="info"
              density="compact"
              :icon="hint.icon"
              variant="tonal"
            >
              <strong>{{ hint.label }}:</strong> {{ hint.value }}
            </v-alert>
          </div>

          <v-alert
            v-if="feedback"
            class="mt-4"
            :color="feedback.type"
            :icon="
              feedback.type === 'success'
                ? 'mdi-check-circle-outline'
                : feedback.type === 'error'
                  ? 'mdi-close-circle-outline'
                  : 'mdi-information-outline'
            "
            variant="tonal"
          >
            {{ feedback.message }}
          </v-alert>

          <v-btn
            v-if="isRoundComplete"
            block
            class="mt-4"
            color="primary"
            prepend-icon="mdi-arrow-right-circle-outline"
            size="large"
            @click="loadQuizRound"
          >
            다음 문제
          </v-btn>
        </v-card-text>
      </template>
    </v-card>

    <p class="mt-3 text-center text-caption text-medium-emphasis">
      Weather data by
      <a href="https://openweathermap.org/" rel="noopener noreferrer" target="_blank"
        >OpenWeather</a
      >
    </p>
  </v-container>
</template>

<style scoped>
.quiz-hero {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary), 0.14),
    rgba(var(--v-theme-surface), 1) 55%,
    rgba(var(--v-theme-info), 0.12)
  );
}

.weather-timeline {
  display: grid;
  grid-template-columns: repeat(5, minmax(128px, 1fr));
  gap: 10px;
  overflow-x: auto;
  padding: 4px 2px 10px;
  scroll-padding-inline: 2px;
  scroll-snap-type: x mandatory;
  overscroll-behavior-inline: contain;
  scrollbar-width: thin;
}

.weather-day {
  min-width: 112px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  scroll-snap-align: start;
}

.weather-day--오늘 {
  border-color: rgba(var(--v-theme-primary), 0.55);
  box-shadow: 0 8px 22px rgba(var(--v-theme-primary), 0.14);
}

a {
  color: rgb(var(--v-theme-primary));
}

@media (max-width: 599px) {
  .weather-timeline {
    grid-auto-columns: minmax(128px, 44%);
    grid-auto-flow: column;
    grid-template-columns: none;
    padding-bottom: 4px;
    scrollbar-width: none;
  }

  .weather-timeline::-webkit-scrollbar {
    display: none;
  }
}
</style>
