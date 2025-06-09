import { createRouter, createWebHistory } from 'vue-router'
import Login from './pages/Login.vue'
import Registration from './pages/Registration.vue'
import Home from './pages/Home.vue'
import Profile from './pages/Profile.vue'
import ArticleDetail from './pages/ArticleDetail.vue'
import LikedArticles from './pages/LikedArticles.vue'
import Subscribers from './pages/Subscribers.vue'
import CreateArticle from './pages/CreateArticle.vue'
import EditArticle from './pages/EditArticle.vue'
import Settings from './pages/Settings.vue'
import VerifyEmail from './pages/VerifyEmail.vue'
import VerifyEmailSuccess from './pages/VerifyEmailSuccess.vue'
import VerifyEmailFailed from './pages/VerifyEmailFailed.vue'

const routes = [
  { path: '/login', component: Login },
  { path: '/registration', component: Registration },
  { path: '/', component: Home },
  { path: '/Profile', component: Profile },
  { path: '/Profile/:id', component: Profile, props: true},
  { path: '/article-detail/:id', component: ArticleDetail },
  { path: '/edit-article/:id', component: EditArticle },
  { path: '/LikedArticles', component: LikedArticles },
  { path: '/Following', component: Subscribers },
  { path: '/CreateArticle', component: CreateArticle },
  { path: '/Settings', component: Settings },
  { path: '/verify-email', component: VerifyEmail },
  { path: '/verify-email-success/:id/:hash', component: VerifyEmailSuccess },
  { path: '/verify-email-failed', component: VerifyEmailFailed },
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
