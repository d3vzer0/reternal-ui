
export function setCommands (state, commands) {
  state.commands = commands
}

export function addCommand (state, command) {
  if (!('type' in command)) {
    command.type = 'Manual'
  }
  state.commands.push(command)
}

export function removeCommand (state, commandRand) {
  state.commands = state.commands.filter(cmd => cmd.rand !== commandRand)
}

export function changeDate (state, date) {
  state.selectedDate = date
}
