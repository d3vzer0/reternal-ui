import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { isAuthenticated } from '../guard/auth'

Vue.use(VueRouter)

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,
    mode: 'history',
    base: process.env.BASE_URL
  })

  Router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && to.meta.requiresAuth === true) {
      if (isAuthenticated() === true) {
        next()
      } else {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      }
    } else {
      next()
    }
  })

  return Router
}
