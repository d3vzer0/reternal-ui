
export function setQueryParams (state, params) {
  state.queryParams = params
}

export function setQueryParam (state, data) {
  state.queryParams[data.id] = data.value
}
