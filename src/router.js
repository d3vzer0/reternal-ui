import Vue from "vue";
import Router from "vue-router";
import store from "./store/index.js";

import Main from "./templates/Main.vue";
import Login from "./templates/Login.vue";
import Home from "./views/Home.vue";
import Macros from "./views/Macros.vue";
import Agents from "./views/Agents.vue";
import AgentDetails from "./views/AgentDetails.vue";
import Mitre from "./views/Mitre.vue";

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
        },
        {
          path: "/mitre",
          name: "Mitre",
          component: Mitre
        },
        {
          path: "/macros",
          name: "Macros",
          component: Macros
        },
        {
          path: "/agents",
          name: "Agents",
          component: Agents
        },
        {
          path: "/agent/:agent_id",
          name: "AgentDetails",
          component: AgentDetails
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
