import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import PrimaryPage from '../components/pages/PrimaryPage.vue'
import RegisterPage from '../components/pages/RegisterPage.vue'
import LoginPage from '../components/pages/LoginPage.vue'
import ProfilePage from '../components/pages/ProfilePage.vue'
import RestoringPage from '../components/pages/RestoringPage.vue'
import ProductCard from '../components/pages/ProductCard.vue'
import CategoryItems from '../components/pages/CategoryItems.vue'
import CartComponent from '../components/pages/CartComponent.vue'
import FavoriteComponent from '../components/pages/FavoriteComponent.vue'
import AdminPanel from '../components/pages/AdminPanel.vue'


const routes = [
  { path: '/', component: PrimaryPage, name : 'PrimaryPage'},
  { path: '/reg', component:  RegisterPage, name : 'RegisterPage'},
  { path: '/login', component:  LoginPage, name : 'LoginPage'},
  { path: '/profile', component:  ProfilePage, name : 'ProfilePage'},
  { path: '/restore', component:  RestoringPage, name : 'RestoringPage'},
  { path: '/product/:slug', component:  ProductCard, name : 'ProductCard'},
  { path: '/products/category/:short_name', component:  CategoryItems, name : 'CategoryItems'},
  { path: '/basket', component:  CartComponent, name : 'CartComponent'},
  { path: '/favorite', component:  FavoriteComponent, name : 'FavoriteComponent'},
  { path: '/admin', component:  AdminPanel, name : 'AdminPanel'},


]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})