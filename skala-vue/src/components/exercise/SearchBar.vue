<script setup>
// 1. 상위로 입력 텍스트를 전달할 커스텀 이벤트 등록 (매크로)
defineEmits(['update-query'])

// 2. 상위로부터 현재 검색 상태 값을 수신 (한글 동기화 상태 유지용)
defineProps({
  currentQuery: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <v-sheet color="transparent">
    <h3 class="text-h6 font-weight-bold">🔍 도시 검색</h3>
    <v-divider class="my-3" />
    <v-text-field
      :model-value="currentQuery"
      clearable
      color="primary"
      hide-details
      label="도시 이름"
      placeholder="검색할 도시 이름 입력"
      prepend-inner-icon="mdi-magnify"
      variant="outlined"
      @update:model-value="$emit('update-query', $event ?? '')"
    />
    <p class="mt-3 text-body-2 text-medium-emphasis">
      검색 중인 도시: <strong class="text-primary">{{ currentQuery }}</strong>
    </p>
  </v-sheet>
</template>
