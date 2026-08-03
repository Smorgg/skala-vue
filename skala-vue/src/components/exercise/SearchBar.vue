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
  <div class="search-inner">
    <h3>🔍 도시 검색</h3>
    <hr />
    <!-- v-model.trim.lazy를 사용해 실습해 본 결과 포커스를 잃거나 엔터를 눌렀을 때만 검색창에 입력이 발생한다. 실시간으로 입력 데이터를 받아야하는 경우가 아니라면 v-model과 modifier를 사용하는 것이 좋다고 판단된다.
    <input type="text"
    v-model.trim.lazy="searchQuery"
    placeholder="검색할 도시 이름 입력"
    /> -->
    <input
      type="text"
      :value="currentQuery"
      @input="$emit('update-query', $event.target.value)"
      placeholder="검색할 도시 이름 입력"
    />
    <p>
      검색 중인 도시: <strong>{{ currentQuery }}</strong>
    </p>
  </div>
</template>
