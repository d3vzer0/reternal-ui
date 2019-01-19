export default {
  namespaced: true,
  state: {
    selected_agents_detailed: {
      Windows: [],
      Linux: [],
      macOS: []
    },
    selected_agents: [],
    selected_command: "",
    command_input: ""
  },
  getters: {
    get_agents(state) {
      return state.selected_agents;
    },
    get_agents_detailed(state) {
      return state.selected_agents_detailed;
    },
    command(state) {
      return state.selected_command;
    },
    input(state) {
      return state.command_input;
    }
  },
  mutations: {
    change_command(state, command) {
      state.selected_command = command;
      if ("input" in command) {
        state.command_input = command.input;
      } else {
        state.command_input = "";
      }
    },
    change_input(state, input){
      state.command_input = input;
    },
    add_agent(state, agent_object) {
      var is_found = state.selected_agents_detailed[agent_object["platform"]].some(function(agent) {
        return agent.beacon_id == agent_object.beacon_id;
      });

      if (!is_found) {
        state.selected_agents_detailed[agent_object["platform"]].push(agent_object);
        state.selected_agents.push(agent_object.beacon_id);
      } else {
        state.selected_agents = state.selected_agents.filter(agent_id => agent_id !== agent_object.beacon_id);
        for ( var i = state.selected_agents_detailed[agent_object["platform"]].length - 1; i >= 0; i--) {
          if ( state.selected_agents_detailed[agent_object["platform"]][i]["beacon_id"] === agent_object.beacon_id) {
            state.selected_agents_detailed[agent_object["platform"]].splice(i, 1);
          }
        }
      }
    }
  }
};
