import Vue from 'vue'

export function options (state, datasources) {
  state.options = datasources
}

export function config (state, values) {
  Vue.set(state.config, values.data_source_name, values)
}

export function comment (state, values) {
  Vue.set(state.config[values.data_source_name], 'comment', values.value)
}

export function retention (state, values) {
  Vue.set(state.config[values.data_source_name].data_quality, 'retention', values.value)
}

export function consistency (state, values) {
  Vue.set(state.config[values.data_source_name].data_quality, 'consistency', values.value)
}

export function timeliness (state, values) {
  Vue.set(state.config[values.data_source_name].data_quality, 'timeliness', values.value)
}

export function fieldCompleteness (state, values) {
  Vue.set(state.config[values.data_source_name].data_quality, 'field_completeness', values.value)
}

export function deviceCompleteness (state, values) {
  Vue.set(state.config[values.data_source_name].data_quality, 'device_completeness', values.value)
}

export function products (state, values) {
  Vue.set(state.config[values.data_source_name], 'products', values.value)
}

export function enabled (state, values) {
  Vue.set(state.config[values.data_source_name], 'enabled', values.value)
}

export function dataAnalytics (state, values) {
  Vue.set(state.config[values.data_source_name], 'available_for_data_analytics', values.value)
}

export function dateConnected (state, values) {
  Vue.set(state.config[values.data_source_name], 'date_connected', values.value)
}

export function dateRegistered (state, values) {
  Vue.set(state.config[values.data_source_name], 'date_registered', values.value)
}
