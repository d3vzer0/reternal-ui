import Vue from 'vue'
import Vuex from 'vuex'
import template from '@/store/template-store'
import auth from '@/store/auth-store'
import error from '@/store/error-store'
import selection from '@/store/selection-store'
import task from '@/store/task-store'
import terminal from '@/store/terminal-store'
import agents from '@/store/agents-store'
import payloads from '@/store/payloads-store'

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    template,
    payloads,
    auth,
    error,
    selection,
    task,
    agents,
    terminal
  }
});

export default store;
