export default {
  namespaced: true,
  state: {
    commands: [],
    techniques: []
  },
  getters: {
    commands(state){
      return state.commands;
    },
    techniques(state){
      return state.techniques;
    }
  },
  mutations: {
    add_command(state, command){
      state.commands.push(command);
    },
    add_technique(state, technique){
      state.techniques.push(technique);
    },
    remove_command(state, command_rand){
      state.commands = state.commands.filter(cmd => cmd.rand !== command_rand);
    }
  }
}