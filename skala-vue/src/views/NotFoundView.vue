<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <v-container class="d-flex align-center justify-center" min-height="80vh">
    <v-empty-state
      headline="페이지를 찾을 수 없습니다."
      icon="mdi-cloud-alert-outline"
      text="요청하신 주소가 존재하지 않거나 아직 개발되지 않았습니다."
      title="404"
    >
      <template #actions>
        <v-btn color="primary" prepend-icon="mdi-home" @click="router.push('/')">
          날씨 메인으로 이동
        </v-btn>
      </template>
    </v-empty-state>
  </v-container>
</template>
