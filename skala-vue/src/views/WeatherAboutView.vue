<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-container class="pa-0" max-width="600">
    <div class="mb-4 d-flex align-center ga-2">
      <v-icon color="primary" icon="mdi-information-outline" />
      <h2 class="text-h5 font-weight-bold">서비스 소개</h2>
    </div>

    <v-card elevation="2" rounded="xl">
      <v-card-text class="pa-6">
        <p class="mb-4 text-body-1">
          본 앱은 Vue 3 및 Vue Router 4 기반으로 제작된 실습용 기상 관측 대시보드 시스템입니다.
        </p>

        <v-list class="feature-list" bg-color="transparent">
          <v-list-item prepend-icon="mdi-puzzle-outline">
            <template #title>
              <code class="text-error">component/exercise/</code> 폴더 내부의 독립 부품 연동
            </template>
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-routes"
            title="클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환"
          />
          <v-list-item
            prepend-icon="mdi-magnify"
            title="URL 쿼리 스트링을 활용한 검색 상태 동기화"
          />
        </v-list>
      </v-card-text>
    </v-card>

    <v-btn
      block
      class="mt-4"
      color="primary"
      prepend-icon="mdi-arrow-left"
      size="large"
      @click="router.push('/')"
    >
      메인 대시보드로 돌아가기
    </v-btn>
  </v-container>
</template>

<style scoped>
.feature-list :deep(.v-list-item) {
  padding-block: 8px;
}

.feature-list :deep(.v-list-item-title) {
  white-space: normal;
  line-height: 1.5;
  text-overflow: initial;
}

@media (max-width: 599px) {
  .feature-list :deep(.v-list-item) {
    padding-inline: 4px;
  }
}
</style>
