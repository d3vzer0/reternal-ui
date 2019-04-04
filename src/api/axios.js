import axios from "axios";
axios.defaults.baseURL = process.env.VUE_APP_BASEAPI;

export default axios.create({
  baseURL: axios.defaults.baseURL,
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.access_token
  }
});
