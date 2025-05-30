import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import Registration from './pages/Registration.vue'
import Home from './pages/Home.vue'
import Profile from './pages/Profile.vue'
import ArticleDetail from './pages/ArticleDetail.vue'
import LikedArticles from './pages/LikedArticles.vue'
const routes = [
  { path: '/login', component: Login },
  { path: '/registration', component: Registration },
  { path: '/', component: Home },
  { path: '/Profile', component: Profile },
  {path: '/Profile/:id', component: Profile, props: true},
  { path: '/article-detail/:id', component: ArticleDetail },
  { path: '/LikedArticles', component: LikedArticles },
  
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
