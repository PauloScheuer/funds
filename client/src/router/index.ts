import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FundsView from '../views/FundsView.vue'
import StocksView from '../views/StocksView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/funds',
      name: 'funds',
      component: () => FundsView
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: () => StocksView
    }
  ]
})

export default router
