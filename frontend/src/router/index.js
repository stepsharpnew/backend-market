import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import PrimaryPage from '../components/pages/PrimaryPage.vue'
import RegisterPage from '../components/pages/RegisterPage.vue'
import LoginPage from '../components/pages/LoginPage.vue'
import ProfilePage from '../components/pages/ProfilePage.vue'
import RestoringPage from '../components/pages/RestoringPage.vue'
import ProductCard from '../components/pages/ProductCard.vue'
import CategoryItems from '../components/pages/CategoryItems.vue'
import CartComponent from '../components/pages/CartComponent.vue'


const routes = [
  { path: '/', component: PrimaryPage },
  { path: '/reg', component:  RegisterPage},
  { path: '/login', component:  LoginPage},
  { path: '/profile', component:  ProfilePage},
  { path: '/restore', component:  RestoringPage},
  { path: '/product/:slug', component:  ProductCard},
  { path: '/products/category/:short_name', component:  CategoryItems},
  { path: '/basket', component:  CartComponent},

]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})