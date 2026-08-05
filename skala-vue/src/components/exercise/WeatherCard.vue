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

const displayTemp = computed(() => {
  const rawTemp = props.cityItem.temp
  if (configStore.unit === 'fahrenheit') {
    return Math.round((rawTemp * 9) / 5 + 32)
  }
  return rawTemp
})
</script>

<template>
  <v-card
    class="mb-3"
    hover
    rounded="lg"
    variant="outlined"
    @click="emit('select-card', `${cityItem.name}이 선택되었습니다.`)"
  >
    <v-card-item>
      <v-card-title>{{ props.cityItem.name }}</v-card-title>
      <v-card-subtitle>{{ props.cityItem.status }}</v-card-subtitle>
    </v-card-item>

    <v-card-text>
      <p class="mb-3 text-body-1">
        현재 기온: <strong>{{ displayTemp }}{{ configStore.unitSymbol }}</strong>
      </p>

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

    <v-card-actions>
      <v-spacer />
      <v-btn
        append-icon="mdi-chevron-right"
        color="primary"
        variant="text"
        @click.stop="emit('click-detail', cityItem.name, cityItem.status)"
      >
        상세보기
      </v-btn>
      <slot name="btn-detail" />
    </v-card-actions>
  </v-card>
</template>
