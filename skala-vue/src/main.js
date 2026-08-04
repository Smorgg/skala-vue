import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
// index.js를 불러옴 (묵시적으로 설정되어 있음)
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
