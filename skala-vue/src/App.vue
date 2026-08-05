<script setup>
import { computed } from 'vue'
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import UnitToggler from './components/exercise/UnitToggler.vue'

const route = useRoute()
const contentWidth = computed(() => (route.name === 'WeatherMapPage' ? 1200 : 1200))
</script>

<template>
  <v-app>
    <v-main class="app-shell">
      <v-container class="py-5 py-md-8" :max-width="contentWidth">
        <header class="mb-6">
          <div class="mb-4 d-flex align-center justify-space-between ga-4">
            <div>
              <div class="text-overline text-primary font-weight-bold">SKALA WEATHER</div>
              <h1 class="app-title font-weight-bold">OpenWeather dotger</h1>
              <p class="d-none d-sm-block mt-1 text-body-2 text-medium-emphasis">
                실시간 날씨와 5일 예보를 한곳에서 확인하세요.
              </p>
            </div>
            <UnitToggler />
          </div>

          <v-sheet
            class="app-navigation overflow-hidden"
            color="surface"
            elevation="2"
            rounded="xl"
          >
            <v-tabs color="primary" grow height="56">
              <v-tab exact prepend-icon="mdi-view-dashboard-outline" to="/">대시보드</v-tab>
              <v-tab prepend-icon="mdi-map-outline" to="/map">기상 지도</v-tab>
              <v-tab prepend-icon="mdi-puzzle-outline" to="/quiz">날씨 퀴즈</v-tab>
              <v-tab prepend-icon="mdi-information-outline" to="/about">서비스 소개</v-tab>
            </v-tabs>
          </v-sheet>
        </header>

        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at 8% 0%, rgba(var(--v-theme-primary), 0.12), transparent 32rem),
    radial-gradient(circle at 100% 18%, rgba(var(--v-theme-info), 0.08), transparent 28rem),
    rgb(var(--v-theme-background));
}

.app-title {
  font-size: clamp(1.75rem, 3vw, 2.35rem);
  line-height: 1.15;
  letter-spacing: -0.04em;
}

.app-navigation {
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

@media (max-width: 599px) {
  .app-navigation :deep(.v-tab) {
    min-width: 0;
    padding-inline: 8px;
    font-size: 0.78rem;
  }

  .app-navigation :deep(.v-btn__prepend) {
    display: none;
  }
}
</style>
