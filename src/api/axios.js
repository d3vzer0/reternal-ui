import axios from 'axios'
import store from '@/store'

axios.defaults.baseURL = process.env.VUE_APP_BASEAPI

export default axios.create({
  baseURL: axios.defaults.baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + store.getters['auth/access_token']
  }
});
