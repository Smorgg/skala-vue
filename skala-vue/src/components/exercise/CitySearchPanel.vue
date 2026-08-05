<script setup>
import { ref } from 'vue'
import SearchBar from './SearchBar.vue'

defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})

defineEmits(['update-query', 'search'])

const isSearchOpen = ref(false)
</script>

<template>
  <div class="city-search-panel d-flex align-start justify-start ga-3 mb-4">
    <v-btn
      class="flex-shrink-0"
      color="primary"
      height="72"
      :prepend-icon="isSearchOpen ? 'mdi-close' : 'mdi-magnify'"
      variant="tonal"
      width="160"
      @click="isSearchOpen = !isSearchOpen"
    >
      {{ isSearchOpen ? '검색 닫기' : '다른 도시 검색' }}
    </v-btn>

    <v-sheet
      :aria-hidden="!isSearchOpen"
      class="search-sheet pa-2"
      :class="{ 'search-sheet--visible': isSearchOpen }"
      elevation="2"
      rounded="lg"
    >
      <SearchBar
        :current-query="currentQuery"
        @search="$emit('search')"
        @update-query="$emit('update-query', $event)"
      />
    </v-sheet>
  </div>
</template>

<style scoped>
.city-search-panel {
  min-height: 72px;
}

.search-sheet {
  flex: 1 1 240px;
  height: 72px;
  min-width: 0;
  max-width: 400px;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transform: translateX(-6px);
  transition:
    opacity 220ms ease,
    transform 220ms ease,
    visibility 0s linear 220ms;
}

.search-sheet--visible {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transform: translateX(0);
  transition-delay: 0s;
}

@media (prefers-reduced-motion: reduce) {
  .search-sheet {
    transition-duration: 1ms;
  }
}
</style>
