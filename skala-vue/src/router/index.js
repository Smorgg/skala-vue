import { createRouter, createWebHistory } from 'vue-router'

// 라우터
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  // 라우츠
  routes: [
    // 라우트
    // static import  어플리케이션 시작 시점에 로드
    {
      path: '/',
      name: 'WeatherHome',
      component: () => import('../views/WeatherHomeView.vue'),
    },
    // dynamic import 해당 컴포넌트가 필요한 순간에 로드 (lazy Loading)
    {
      path: '/about',
      name: 'WeatherAbout',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/WeatherAboutView.vue'),
    },
    {
      path: '/weather/:cityId',
      name: 'WeatherDetail',
      component: () => import('../views/WeatherDetailView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
