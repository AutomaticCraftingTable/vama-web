import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Registration from '@/pages/Registration.vue'
const routes = [
  { path: '/login', component: Login },
  { path: '/registration', component: Registration },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
