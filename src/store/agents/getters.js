
export function getSelected (state) {
  return state.selected
}

export function agentOptions (state) {
  var agentList = []
  state.options.forEach(agent => {
    agentList.push({ 'label': agent.name, 'value': agent.name, 'integration': agent.integration })
  })
  return agentList
}
