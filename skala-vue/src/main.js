import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import App from './App.vue'
// index.js를 불러옴 (묵시적으로 설정되어 있음)
import router from './router'

const app = createApp(App)
const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'system',
    themes: {
      light: {
        colors: {
          background: '#F3F7FB',
          surface: '#FFFFFF',
          primary: '#1976D2',
          secondary: '#0288D1',
          info: '#039BE5',
          success: '#2E7D32',
          warning: '#F59E0B',
          error: '#D14343',
        },
      },
      dark: {
        colors: {
          background: '#0B1220',
          surface: '#121C2B',
          primary: '#64B5F6',
          secondary: '#4DD0E1',
          info: '#4FC3F7',
          success: '#66BB6A',
          warning: '#FFCA28',
          error: '#EF8A9A',
        },
      },
    },
  },
})

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
