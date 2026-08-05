import { ref } from 'vue'
import { defineStore } from 'pinia'

const RECENT_SEARCHES_KEY = 'skala-weather-recent-searches'
const MAX_RECENT_SEARCHES = 5

export const useSearchHistoryStore = defineStore('searchHistory', () => {
  const recentSearches = ref([])
  const isHydrated = ref(false)

  const persist = () => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recentSearches.value))
    } catch {
      // 저장소를 사용할 수 없는 환경에서도 검색 기능은 그대로 유지합니다.
    }
  }

  const hydrate = () => {
    if (isHydrated.value) return

    try {
      const savedSearches = JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]')
      recentSearches.value = Array.isArray(savedSearches)
        ? savedSearches.filter((item) => typeof item === 'string').slice(0, MAX_RECENT_SEARCHES)
        : []
    } catch {
      recentSearches.value = []
    } finally {
      isHydrated.value = true
    }
  }

  const addRecentSearch = (query) => {
    const normalizedQuery = query.trim()
    if (!normalizedQuery) return

    hydrate()
    recentSearches.value = [
      normalizedQuery,
      ...recentSearches.value.filter((item) => item !== normalizedQuery),
    ].slice(0, MAX_RECENT_SEARCHES)
    persist()
  }

  const clearRecentSearches = () => {
    hydrate()
    recentSearches.value = []
    persist()
  }

  return {
    recentSearches,
    hydrate,
    addRecentSearch,
    clearRecentSearches,
  }
})
