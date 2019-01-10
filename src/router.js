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
import Recipe from "./views/Recipe.vue";
import Payloads from "./views/Payloads.vue";
import Startup from "./views/Startup.vue";
import Terminal from "./views/Terminal.vue";
import Mapping from "./views/Mapping.vue";
import AgentTasks from "./views/AgentTasks";
import Recipes from "./views/Recipes.vue";

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
          path: "/terminal",
          name: "Terminal",
          component: Terminal
        },
        {
          path: "/payloads",
          name: "Payloads",
          component: Payloads
        },
        {
          path: "/recipe",
          name: "Recipe",
          component: Recipe
        },
        {
          path: "/startup",
          name: "Startup",
          component: Startup
        },
        {
          path: "/mitre",
          name: "Mitre",
          component: Mitre
        },
        {
          path: "/mapping",
          name: "Mapping",
          component: Mapping
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
        },
        {
          path: "/tasks/:agent_id",
          name: "AgentTasks",
          component: AgentTasks
        },
        {
          path: "/recipes",
          name: "Recipes",
          component: Recipes
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
    if (!store.getters["auth/session"]) {
      next({
        path: "/login",
        query: { redirect: to.fillPath }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
