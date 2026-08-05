<script setup>
import { onBeforeUnmount, reactive, ref } from 'vue'

const userForm = ref({
  email: '',
  agree: false,
})

const productQuantity = ref(1)
const productRate = ref(4)

const deleteDialog = ref(false)
const downloadProgress = ref(0)
const isDownloading = ref(false)

const snackbar = reactive({
  visible: false,
  message: '',
  color: 'info',
})

let downloadTimer

const showFeedback = (message, color = 'info') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.visible = true
}

const handleRegister = () => {
  if (!userForm.value.email?.includes('@')) {
    showFeedback('❌ 올바른 이메일 형식이 아닙니다.', 'error')
    return
  }

  if (!userForm.value.agree) {
    showFeedback('⚠️ 이용약관에 동의하셔야 합니다.', 'warning')
    return
  }

  showFeedback('🎉 가입 신청이 정상적으로 완료되었습니다!', 'success')
}

const confirmDelete = () => {
  deleteDialog.value = false
  showFeedback('🗑️ 파일이 안전하게 파쇄되었습니다.', 'success')
}

const cancelDelete = () => {
  deleteDialog.value = false
  showFeedback('❌ 삭제 작업이 취소되었습니다.')
}

const startDownload = () => {
  if (isDownloading.value) return

  isDownloading.value = true
  downloadProgress.value = 0

  downloadTimer = window.setInterval(() => {
    downloadProgress.value += 20

    if (downloadProgress.value >= 100) {
      window.clearInterval(downloadTimer)
      downloadTimer = undefined
      isDownloading.value = false
      showFeedback('💾 대용량 데이터 로드가 완료되었습니다!', 'success')
    }
  }, 400)
}

onBeforeUnmount(() => {
  if (downloadTimer) window.clearInterval(downloadTimer)
})
</script>

<template>
  <section class="practice-section">
    <header class="practice-header">
      <h2>🧪 Vuetify 활용 실습</h2>
      <p>외부 API와 무관하게 템플릿과 상태값 변동만을 관측하는 샘플입니다.</p>
    </header>

    <v-card class="practice-card" elevation="2" rounded="lg">
      <v-card-title class="card-title">📝 실습 1. 회원가입 Form & 인풋 제어</v-card-title>
      <v-divider />

      <v-card-text>
        <v-form class="card-body" @submit.prevent="handleRegister">
          <v-text-field
            v-model="userForm.email"
            clearable
            label="이메일 주소"
            placeholder="example@email.com"
            prepend-inner-icon="mdi-email-outline"
            type="email"
            variant="outlined"
          />

          <v-switch
            v-model="userForm.agree"
            color="success"
            hide-details
            inset="square"
            true-icon="mdi-check"
            false-icon="mdi-close"
            label="개인정보 수집 및 필수 이용약관에 동의합니다."
          />

          <v-btn
            block
            color="success"
            prepend-icon="mdi-rocket-launch-outline"
            size="large"
            type="submit"
          >
            회원가입하기
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <v-card class="practice-card" elevation="2" rounded="lg">
      <v-card-title class="card-title">🛒 실습 2. 커머스 상품 수량 및 평점 시스템</v-card-title>
      <v-divider />

      <v-card-text class="card-body">
        <v-number-input
          v-model="productQuantity"
          :max="10"
          :min="1"
          control-variant="split"
          hint="최대 10개 구매 가능"
          label="구매 수량 선택"
          persistent-hint
          variant="outlined"
        />

        <div class="rating-group">
          <span class="field-label">상품 만족도 별점:</span>
          <v-rating
            v-model="productRate"
            active-color="warning"
            color="grey-lighten-1"
            hover
            :length="5"
            size="32"
          />
          <strong>{{ productRate }}점</strong>
        </div>

        <v-alert color="success" density="compact" icon="mdi-book-check-outline" variant="tonal">
          <strong>실시간 장부 요약:</strong> 선택 수량 {{ productQuantity }}개 / 내가 준 점수
          {{ productRate }}점
        </v-alert>
      </v-card-text>
    </v-card>

    <v-card class="practice-card" elevation="2" rounded="lg">
      <v-card-title class="card-title">⚙️ 실습 3. 시스템 피드백 & 프로그레스 인터랙션</v-card-title>
      <v-divider />

      <v-card-text class="card-body">
        <div class="button-zone">
          <v-btn
            color="error"
            prepend-icon="mdi-delete-alert-outline"
            variant="tonal"
            @click="deleteDialog = true"
          >
            서버 파일 삭제 테스트
          </v-btn>

          <v-btn
            color="primary"
            :loading="isDownloading"
            prepend-icon="mdi-database-sync-outline"
            @click="startDownload"
          >
            {{ isDownloading ? '동기화 중...' : '데이터 동기화 시작' }}
          </v-btn>
        </div>

        <div class="progress-zone">
          <v-progress-linear
            :color="downloadProgress === 100 ? 'success' : 'primary'"
            height="22"
            :model-value="downloadProgress"
            rounded
          >
            <strong>{{ downloadProgress }}%</strong>
          </v-progress-linear>
        </div>
      </v-card-text>
    </v-card>

    <v-dialog v-model="deleteDialog" max-width="480" persistent>
      <v-card rounded="lg">
        <v-card-title class="dialog-title">
          <v-icon color="error" icon="mdi-alert" />
          최종 경고
        </v-card-title>
        <v-card-text>서버에서 해당 파일을 영구히 삭제하시겠습니까?</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="cancelDelete">취소</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete">네, 삭제합니다</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.visible"
      :color="snackbar.color"
      location="top right"
      :timeout="3000"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn
          aria-label="알림 닫기"
          icon="mdi-close"
          variant="text"
          @click="snackbar.visible = false"
        />
      </template>
    </v-snackbar>
  </section>
</template>

<style scoped>
.practice-section {
  grid-column: 1 / -1;
  width: min(100%, 760px);
  margin: 0 auto;
}

.practice-header {
  margin-bottom: 24px;
}

.practice-header h2 {
  margin-bottom: 8px;
}

.practice-header p {
  color: #667085;
}

.practice-card {
  margin-bottom: 24px;
}

.card-title {
  padding: 18px 20px;
  font-size: 1rem;
  font-weight: 700;
  white-space: normal;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px 4px;
}

.rating-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.field-label {
  min-width: 130px;
  font-size: 0.875rem;
}

.button-zone {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.progress-zone {
  margin-top: 4px;
}

.dialog-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding-top: 20px;
}

@media (max-width: 600px) {
  .button-zone > :deep(.v-btn) {
    width: 100%;
  }
}
</style>
