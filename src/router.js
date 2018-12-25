import Vue from "vue";
import Router from "vue-router";
import Main from "./templates/Main.vue";
import Login from "./templates/Login.vue";
import Home from "./views/Home.vue";
import store from "./store/index.js";


Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "Root",
      component: Main,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "/home",
          name: "Home",
          component: Home
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "*",
      redirect: "/"
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters['auth/session']){
      next({
        path: '/login',
        query: { redirect: to.fillPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

export default router;
