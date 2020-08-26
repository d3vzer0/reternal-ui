
export function setQueryParams (state, params) {
  state.queryParams = params
}

export function setQueryParam (state, data) {
  state.queryParams[data.id] = data.value
}

export function addVerify (state, data) {
  state.verifyRules.push(data)
}

export function pullVerify (state, ruleId) {
  state.verifyRules = state.verifyRules.filter(rule => rule.id !== ruleId)
}
