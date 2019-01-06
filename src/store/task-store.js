export default {
  namespaced: true,
  state: {
    commands: [],
    selected_date: ""
  },
  getters: {
    commands(state){
      return state.commands;
    },
    techniques(state){
      return state.techniques;
    },
    date(state){
      return state.selected_date;
    }
  },
  mutations: {
    add_command(state, command) {
      if (!("type" in command)) {
        command.type = "manual";
      }
      state.commands.push(command);
    },
    remove_command(state, command_rand){
      state.commands = state.commands.filter(cmd => cmd.rand !== command_rand);
    },
    change_date(state, date){
      state.selected_date = date;
    }
  }
}