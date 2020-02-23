import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'
import queue from './queue'
import integrations from './integrations'
import agents from './agents'
import scheduler from './scheduler'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      queue,
      integrations,
      agents,
      scheduler
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
