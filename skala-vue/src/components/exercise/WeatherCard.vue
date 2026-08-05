<script setup>
import { computed } from 'vue'
import { useConfigStore } from '@/stores/configStore'
// 1. 상위로부터 단방향 주입받을 객체 데이터 규격 검수 (매크로)
const props = defineProps({
  cityItem: {
    type: Object,
    required: true,
  },
})

// 2. 상위로 송신할 두 가지 경로의 커스텀 이벤트 식별자 등록 (매크로)
const emit = defineEmits(['select-card', 'click-detail'])

const configStore = useConfigStore()

const normalizedCondition = computed(() =>
  (props.cityItem.condition || props.cityItem.status || '').toLowerCase(),
)

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }

  return rawTemp
})

const weatherThemeClass = computed(() => {
  const condition = normalizedCondition.value

  if (condition.includes('clear') || condition.includes('맑')) return 'weather-card--clear'
  if (condition.includes('cloud') || condition.includes('구름') || condition.includes('흐림')) {
    return 'weather-card--cloudy'
  }
  if (
    condition.includes('rain') ||
    condition.includes('drizzle') ||
    condition.includes('thunder') ||
    condition.includes('비') ||
    condition.includes('소나기')
  ) {
    return 'weather-card--rain'
  }
  if (condition.includes('snow') || condition.includes('눈')) return 'weather-card--snow'
  if (
    condition.includes('mist') ||
    condition.includes('fog') ||
    condition.includes('haze') ||
    condition.includes('안개')
  ) {
    return 'weather-card--mist'
  }
  return 'weather-card--default'
})

const weatherIcon = computed(() => {
  const condition = normalizedCondition.value

  if (condition.includes('clear') || condition.includes('맑')) return 'mdi-weather-sunny'
  if (condition.includes('cloud') || condition.includes('구름') || condition.includes('흐림')) {
    return 'mdi-weather-cloudy'
  }
  if (condition.includes('thunder')) return 'mdi-weather-lightning-rainy'
  if (
    condition.includes('rain') ||
    condition.includes('drizzle') ||
    condition.includes('비') ||
    condition.includes('소나기')
  ) {
    return 'mdi-weather-rainy'
  }
  if (condition.includes('snow') || condition.includes('눈')) return 'mdi-weather-snowy'
  return 'mdi-weather-fog'
})
</script>

<template>
  <v-card
    class="weather-card"
    :class="weatherThemeClass"
    hover
    link
    rounded="xl"
    variant="elevated"
    @click="emit('click-detail', cityItem.name, cityItem.status)"
  >
    <v-card-item class="pa-5 pb-2">
      <v-card-title class="font-weight-bold">{{ props.cityItem.name }}</v-card-title>
      <v-card-subtitle>{{ props.cityItem.status }}</v-card-subtitle>
      <template #append>
        <div class="weather-icon d-flex align-center justify-center">
          <v-icon color="primary" :icon="weatherIcon" size="38" />
        </div>
      </template>
    </v-card-item>

    <v-card-text class="flex-grow-1 px-5 pb-3">
      <div class="mb-4">
        <div class="text-caption text-medium-emphasis">현재 기온</div>
        <strong class="temperature text-h4 font-weight-bold">
          {{ displayTemp }}{{ configStore.unitSymbol }}
        </strong>
      </div>

      <v-chip v-if="cityItem.temp > 25" color="error" prepend-icon="mdi-weather-sunny" size="small">
        더움
      </v-chip>
      <v-chip
        v-else-if="cityItem.temp === 25"
        color="success"
        prepend-icon="mdi-weather-partly-cloudy"
        size="small"
      >
        보통
      </v-chip>
      <v-chip v-else color="info" prepend-icon="mdi-snowflake" size="small">선선함</v-chip>
    </v-card-text>

    <v-card-actions class="px-5 pb-4 pt-0">
      <v-spacer />
      <span class="d-inline-flex align-center ga-1 text-body-2 text-primary font-weight-medium">
        상세보기
        <v-icon icon="mdi-chevron-right" size="small" />
      </span>
      <slot name="btn-detail" />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
.weather-card {
  --weather-start: rgba(var(--v-theme-primary), 0.14);
  --weather-end: rgba(var(--v-theme-info), 0.12);
  --weather-border: rgba(var(--v-theme-primary), 0.22);
  --weather-shadow: rgba(var(--v-theme-primary), 0.08);
  --weather-start-hover: rgba(var(--v-theme-primary), 0.2);
  --weather-end-hover: rgba(var(--v-theme-info), 0.18);
  --weather-border-hover: rgba(var(--v-theme-primary), 0.36);
  --weather-shadow-hover: rgba(var(--v-theme-primary), 0.14);

  background: linear-gradient(
    135deg,
    var(--weather-start) 0%,
    rgba(var(--v-theme-surface), 0.98) 55%,
    var(--weather-end) 100%
  );
  border-color: var(--weather-border);
  box-shadow: 0 8px 24px var(--weather-shadow);
  min-height: 240px;
  transition:
    transform 220ms ease,
    background 220ms ease,
    border-color 220ms ease,
    box-shadow 220ms ease;
}

.weather-card:hover {
  transform: translateY(-3px);
  background: linear-gradient(
    135deg,
    var(--weather-start-hover) 0%,
    rgba(var(--v-theme-surface), 1) 55%,
    var(--weather-end-hover) 100%
  );
  border-color: var(--weather-border-hover);
  box-shadow: 0 12px 30px var(--weather-shadow-hover);
}

.weather-icon {
  width: 58px;
  height: 58px;
  border: 1px solid rgba(var(--v-theme-primary), 0.18);
  border-radius: 18px;
  background: rgba(var(--v-theme-primary), 0.1);
}

.temperature {
  letter-spacing: -0.04em;
}

.weather-card--clear {
  --weather-start: rgba(255, 193, 7, 0.3);
  --weather-end: rgba(255, 152, 0, 0.16);
  --weather-border: rgba(255, 152, 0, 0.32);
  --weather-shadow: rgba(255, 152, 0, 0.12);
  --weather-start-hover: rgba(255, 193, 7, 0.4);
  --weather-end-hover: rgba(255, 152, 0, 0.24);
  --weather-border-hover: rgba(255, 152, 0, 0.48);
  --weather-shadow-hover: rgba(255, 152, 0, 0.2);
}

.weather-card--cloudy {
  --weather-start: rgba(120, 144, 156, 0.28);
  --weather-end: rgba(96, 125, 139, 0.15);
  --weather-border: rgba(96, 125, 139, 0.3);
  --weather-shadow: rgba(69, 90, 100, 0.12);
  --weather-start-hover: rgba(120, 144, 156, 0.38);
  --weather-end-hover: rgba(96, 125, 139, 0.23);
  --weather-border-hover: rgba(96, 125, 139, 0.46);
  --weather-shadow-hover: rgba(69, 90, 100, 0.18);
}

.weather-card--rain {
  --weather-start: rgba(33, 150, 243, 0.3);
  --weather-end: rgba(3, 169, 244, 0.16);
  --weather-border: rgba(30, 136, 229, 0.32);
  --weather-shadow: rgba(25, 118, 210, 0.13);
  --weather-start-hover: rgba(33, 150, 243, 0.4);
  --weather-end-hover: rgba(3, 169, 244, 0.24);
  --weather-border-hover: rgba(30, 136, 229, 0.48);
  --weather-shadow-hover: rgba(25, 118, 210, 0.2);
}

.weather-card--snow {
  --weather-start: rgba(128, 222, 234, 0.3);
  --weather-end: rgba(179, 229, 252, 0.22);
  --weather-border: rgba(77, 208, 225, 0.34);
  --weather-shadow: rgba(38, 198, 218, 0.12);
  --weather-start-hover: rgba(128, 222, 234, 0.42);
  --weather-end-hover: rgba(179, 229, 252, 0.3);
  --weather-border-hover: rgba(77, 208, 225, 0.5);
  --weather-shadow-hover: rgba(38, 198, 218, 0.18);
}

.weather-card--mist {
  --weather-start: rgba(176, 190, 197, 0.3);
  --weather-end: rgba(144, 164, 174, 0.17);
  --weather-border: rgba(120, 144, 156, 0.3);
  --weather-shadow: rgba(84, 110, 122, 0.1);
  --weather-start-hover: rgba(176, 190, 197, 0.4);
  --weather-end-hover: rgba(144, 164, 174, 0.25);
  --weather-border-hover: rgba(120, 144, 156, 0.46);
  --weather-shadow-hover: rgba(84, 110, 122, 0.17);
}

@media (prefers-reduced-motion: reduce) {
  .weather-card {
    transition-duration: 1ms;
  }
}
</style>
