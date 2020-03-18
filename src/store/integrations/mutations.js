
export function setIntegrations (state, integrations) {
  state.integrationOptions = integrations
}

export function setStagers (state, stagerData) {
  state.stagers[stagerData.integration] = stagerData.stagers
}
