<script setup>
import { useConfigStore } from '@/stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <v-sheet class="d-flex align-center ga-2" color="transparent">
    <span class="d-none d-md-inline text-body-2 text-medium-emphasis"
      >날씨 단위: {{ configStore.unit === 'celsius' ? '섭씨' : '화씨' }} ({{
        configStore.unitSymbol
      }})</span
    >
    <v-btn
      color="primary"
      prepend-icon="mdi-swap-horizontal"
      size="small"
      variant="tonal"
      @click="configStore.toggleUnit"
    >
      단위 변경
    </v-btn>
  </v-sheet>
</template>
