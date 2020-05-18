
export function getIntegrations (state) {
  return state.integrationOptions
}

export function integrationOptions (state) {
  var options = []
  for (var integration in state.integrationOptions) {
    options.push({ 'value': integration, 'label': integration })
  }
  return options
}
