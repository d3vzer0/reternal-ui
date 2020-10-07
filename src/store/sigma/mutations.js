
export function setQueryParams (state, params) {
  state.queryParams = params
}

export function setQueryParam (state, data) {
  state.queryParams = { ...state.queryParams, [data.id]: data.value }
}

export function setFilterValues (state, data) {
  state.filterValues = { }
  for (const [field, values] of Object.entries(data)) {
    state.filterValues[field] = [{ value: '', label: 'Any' }]
    values.forEach(option => {
      state.filterValues[field].push({ 'value': option, 'label': option })
    })
  }
}

export function addVerify (state, data) {
  state.verifyRules.push(data)
}

export function pullVerify (state, ruleId) {
  state.verifyRules = state.verifyRules.filter(rule => rule.id !== ruleId)
}
