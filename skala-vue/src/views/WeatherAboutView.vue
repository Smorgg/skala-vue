<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <h2>서비스 소개</h2>
  <div class="about-content">
    <p>본 앱은 Vue 3 및 Vue Router 4 기반 제작된 실습용 기상 관측 대시보드 시스템입니다.</p>
    <ul>
      <li><span class="code-style">component/exercise/</span> 폴더 내부의 독립 부품 연동</li>
      <li>클라이언트 사이드 라우팅을 통한 새로고침 없는 화면 전환</li>
      <li>URL 쿼리 스트링 매핑을 활용한 실시간 검색 상태 동기화</li>
    </ul>
  </div>
  <button @click="router.push('/')" class="btn-home">매인 대시보드로 돌아가기</button>
</template>

<style scoped>
.about-container {
  display: flex;
  justify-content: left;
  align-items: left;
  /* 부모 요소(예: App.vue)에서 남은 높이를 다 쓰도록 설정 */
  min-height: 80vh;
  background-color: #f8f9fa; /* 아주 연한 회색 배경 */
  font-family: 'Noto Sans KR', sans-serif; /* 기본 폰트 설정 (옵션) */
}

.about-content {
  text-align: left;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 은은한 그림자 */
  border: 1px solid #e9ecef;
}
.code-style {
  color: red;
  background-color: yellow;
}
.btn-home {
  width: 100%;
  margin-top: 15px;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}
</style>
