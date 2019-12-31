import axios from 'axios'
import store from '@/store'


export default axios.create({
  baseURL: 'http://127.0.0.1:5000/api/v1',
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + store.getters['auth/access_token']
  }
});
