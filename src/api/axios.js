import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:5000/api/v1/'

export default axios.create({
  baseURL: axios.defaults.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.token
  }
})