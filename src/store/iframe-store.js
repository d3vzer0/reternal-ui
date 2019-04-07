export default {
  namespaced: true,
  state: {
    shown: false,
    loading: false,
  },
  getters: {
    get_state (state) {
      return state.shown;
    },
    get_loading (state) {
      return state.loading
    }
  },
  mutations: {
    set_state (state, new_state) {
      state.shown = new_state
    },
    set_loading (state, new_state) {
      state.loading = new_state
    }
  }
};
