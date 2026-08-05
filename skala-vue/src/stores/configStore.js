import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// defineStore의  첫번째 인자는 use{첫번째 인자)Store!!
export const useConfigStore = defineStore('config', () => {
  const unit = ref('celsius')

  const unitSymbol = computed(() => {
    return unit.value === 'celsius' ? '℃' : '℉'
  })

  const toggleUnit = computed(() => {
    unit.value = unit.value === 'celsius' ? 'fahrenheit' : 'celsius'
  })

  return { unit, unitSymbol, toggleUnit }
})
