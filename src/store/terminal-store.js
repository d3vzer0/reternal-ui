export default {
  namespaced: true,
  state: {
    terminal_output: []
  },
  getters: {
    output(state) {
      return state.terminal_output;
    }
  },
  mutations: {
    add_output(state, result) {
      state.terminal_output.push(result);
    },
    clear_output(state){
      state.terminal_output = [];
    }
  }
};
