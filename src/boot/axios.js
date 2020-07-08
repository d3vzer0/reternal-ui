import Vue from 'vue'
import axios from 'axios'
import config from '../statics/config.json'
import VueAxios from 'vue-axios'
import store from '../store'

const axiosInstance = axios.create({
  baseURL: config['backend'],
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(function (config) {
  config.headers['Authorization'] = 'Bearer ' + store.state.user.access_token
  return config
})

Vue.prototype.$axios = axiosInstance
Vue.use(VueAxios, axios)
