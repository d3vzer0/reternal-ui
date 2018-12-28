import Vue from "vue";
import Vuex from "vuex";
import template from "@/store/template-store";
import auth from "@/store/auth-store";
import error from "@/store/error-store";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    template,
    auth,
    error
  }
})

export default store;
