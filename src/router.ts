import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/pages/Login.vue'
import Registration from '@/pages/Registration.vue'
import HomeNotLogged from '@/pages/HomeNotLogged.vue'
import HomeLogged from '@/pages/HomeLogged.vue'
const routes = [
  { path: '/login', component: Login },
  { path: '/registration', component: Registration },
  { path: '/homeNotLogged', component: HomeNotLogged },
  { path: '/homeLogged', component: HomeLogged },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
