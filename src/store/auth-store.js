import VueJwtDecode from "vue-jwt-decode";

export default {
  namespaced: true,
  state: {
    access_token: localStorage.access_token || false,
    refresh_token: localStorage.refresh_token || false,
    username: "",
    role: ""
  },
  mutations: {
    set_claims(state, payload) {
      state.username = VueJwtDecode.decode(payload).identity;
      state.role = VueJwtDecode.decode(payload).user_claims.role;
    },
    set_access_token(state, token){
      localStorage.access_token = token;
      state.access_token = token;
    },
    set_refresh_token(state, token){
      localStorage.refresh_token = token;
      state.refresh_token = token;
    },
    delete_refresh_token(state){
      state.refresh_token = false;
      delete localStorage.refresh_token;
    },
    delete_access_token(state){
      state.access_token = false;
      delete localStorage.access_token;
    }
  },
  getters: {
    claims(state) {
      return { role: state.role, username: state.username };
    },
    is_refresh(state) {
      return state.is_refresh;
    },
    access_token(state){
      return state.access_token;
    },
    refresh_token(state){
      return state.refresh_token;
    }
  }
};
