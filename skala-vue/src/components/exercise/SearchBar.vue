<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(['update-query', 'search'])

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <v-sheet class="d-flex align-center ga-2" color="transparent">
    <v-text-field
      class="search-input"
      :model-value="currentQuery"
      clearable
      color="primary"
      hide-details
      label="도시 이름"
      placeholder="검색할 도시 이름 입력"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      @update:model-value="$emit('update-query', $event ?? '')"
      @keyup.enter="$emit('search')"
    />
    <v-btn
      aria-label="도시 검색"
      color="primary"
      icon="mdi-magnify"
      variant="flat"
      @click="$emit('search')"
    />
  </v-sheet>
</template>

<style scoped>
.search-input {
  min-width: 0;
}
</style>
