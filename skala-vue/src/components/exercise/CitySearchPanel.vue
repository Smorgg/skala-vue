<script setup>
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'
import { useSearchHistoryStore } from '@/stores/searchHistoryStore'
import SearchBar from './SearchBar.vue'

const props = defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update-query', 'search'])

const isSearchOpen = ref(false)
const { mdAndUp } = useDisplay()
const isSearchVisible = computed(() => mdAndUp.value || isSearchOpen.value)

const searchHistoryStore = useSearchHistoryStore()
const { recentSearches } = storeToRefs(searchHistoryStore)

const submitSearch = (query = props.currentQuery) => {
  const normalizedQuery = query.trim()
  emit('update-query', normalizedQuery)
  emit('search', normalizedQuery)
}

onMounted(searchHistoryStore.hydrate)
</script>

<template>
  <div class="city-search-panel mb-4 d-flex flex-column flex-md-row align-stretch ga-2 ga-md-3">
    <v-expand-transition>
      <div
        v-show="isSearchVisible"
        :aria-hidden="!isSearchVisible"
        class="search-content d-flex flex-column flex-lg-row align-stretch ga-3"
      >
        <v-sheet class="search-sheet pa-2" elevation="2" rounded="lg">
          <SearchBar
            :current-query="currentQuery"
            @search="submitSearch()"
            @update-query="emit('update-query', $event)"
          />
        </v-sheet>

        <div
          v-if="recentSearches.length"
          class="recent-searches d-flex flex-wrap align-center ga-2"
          aria-label="최근 검색어"
        >
          <span class="flex-shrink-0 text-caption text-medium-emphasis">최근 검색</span>
          <v-chip
            v-for="query in recentSearches"
            :key="query"
            color="primary"
            size="small"
            variant="tonal"
            @click="submitSearch(query)"
          >
            {{ query }}
          </v-chip>
          <v-btn
            aria-label="최근 검색어 모두 지우기"
            icon="mdi-close-circle-outline"
            size="x-small"
            title="최근 검색어 모두 지우기"
            variant="text"
            @click="searchHistoryStore.clearRecentSearches"
          />
        </div>
      </div>
    </v-expand-transition>
  </div>
</template>

<style scoped>
.city-search-panel {
  min-height: 52px;
}

.search-content {
  width: 100%;
  min-width: 0;
}

.search-sheet {
  width: 100%;
  min-width: 0;
  max-width: 560px;
}

.recent-searches {
  min-width: 0;
  min-height: 52px;
}

@media (min-width: 960px) {
  .city-search-panel {
    min-height: 72px;
  }

  .recent-searches {
    min-height: 72px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .city-search-panel :deep(.v-expand-transition-enter-active),
  .city-search-panel :deep(.v-expand-transition-leave-active) {
    transition-duration: 1ms !important;
  }
}
</style>
