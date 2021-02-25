import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import store from '../store'
import HomePage from '../views/HomePage.vue'
import SearchPage from '../views/SearchPage.vue'
import NotFoundPage from '../views/NotFoundPage.vue'
import CreateHousePage from '../views/CreateHousePage.vue'

// User Pages
import ProfilePage from '../views/user/ProfilePage.vue'
import HousesPages from '../views/user/HousesPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
  },
  {
    path: '/search',
    name: 'SearchPage',
    component: SearchPage,
  },
  {
    path: '/house',
    redirect: {
      name: 'ProfilePage',
    },
  },
  {
    path: '/house/new',
    name: 'CreateHousePage',
    component: CreateHousePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/user',
    redirect: { name: 'ProfilePage' },
  },
  {
    path: '/user/profile',
    name: 'ProfilePage',
    component: ProfilePage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/user/houses',
    name: 'HousesPages',
    component: HousesPages,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFoundPage',
    component: NotFoundPage,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to, _from, next) => {
  if (to.matched.some(route => route.meta.requiresAuth)) {
    if (store.state.authId) {
      next()
    } else {
      next({ name: 'HomePage' })
    }
  } else {
    next()
  }
})

export default router
