import { createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '@/pages/HelloWorld.vue'
import Profile from '@/pages/Profile.vue'

const routes = [
  { path: '/', component: HelloWorld },
  { path: '/profile', component: Profile },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
