import Vue from 'vue'
import axios from 'axios'
import config from '../assets/config.json'

const axiosInstance = axios.create({
  baseURL: config['backend'],
  headers: {
    'Content-Type': 'application/json'
  }
})

Vue.prototype.$axios = axiosInstance
