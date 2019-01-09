export default {
  namespaced: true,
  state: {
    agent: false
  },
  mutations: {
    update_agent(state, agent) {
      state.agent = agent;
    }
  },
  getters: {
    agent(state) {
      return state.agent;
    }
  }
};
