import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import PrimaryPage from '../components/pages/PrimaryPage.vue'
import RegisterPage from '../components/pages/RegisterPage.vue'
import LoginPage from '../components/pages/LoginPage.vue'
import ProfilePage from '../components/pages/ProfilePage.vue'
import RestoringPage from '../components/pages/RestoringPage.vue'


const routes = [
  { path: '/', component: PrimaryPage },
  { path: '/reg', component:  RegisterPage},
  { path: '/login', component:  LoginPage},
  { path: '/profile', component:  ProfilePage},
  { path: '/restore', component:  RestoringPage},

]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})