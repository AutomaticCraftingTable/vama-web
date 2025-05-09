import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Registration from '@/pages/Registration.vue'
import Home from '@/pages/Home.vue'
import VeriFailed from '@/pages/VeriFailed.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/registration', component: Registration },
  { path: '/', component: Home },
  { path: '/emailFailed', component: VeriFailed },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
