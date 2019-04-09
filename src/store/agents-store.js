export default {
    namespaced: true,
    state: {
        all_agents: [],
        c2_dest: ''
    },
    getters: {
      get_agents(state) {
        return state.all_agents
      },
      get_dest (state) {
        return state.c2_dest
      }
    },
    mutations: {
      add_agent(state, agent_object) {
        var is_found = state.all_agents.some(function(agent) {
          return agent.beacon_id == agent_object.beacon_id
        });
        if (!is_found) {
          state.all_agents.push(agent_object)
        }
      },
      set_dest (state, destination) {
        state.c2_dest = destination
      }
    }
  };
  