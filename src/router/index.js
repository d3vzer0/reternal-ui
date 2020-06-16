import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import { isAuthenticated } from '../guard/auth'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

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
