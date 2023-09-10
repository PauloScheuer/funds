import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FundsView from '../views/FundsView.vue'
import StocksView from '../views/StocksView.vue'
import SimilarFundsView from '../views/SimilarFundsView.vue'
import InsightsView from '../views/InsightsView.vue'

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
      component: FundsView
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: StocksView
    },
    {
      path: '/similarFunds/:id',
      name: 'similarFunds',
      component: SimilarFundsView
    },
    {
      path: '/insights',
      name: 'insights',
      component: InsightsView
    }
  ]
})

export default router
