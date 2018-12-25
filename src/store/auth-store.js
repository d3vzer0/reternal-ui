import VueJwtDecode from "vue-jwt-decode";

export default {
  namespaced: true,
  state: {
    token: localStorage.token || "",
    username: "",
    role: ""
  },
  actions: {
  },
  mutations: {
    update_session(state, payload){
      state.username = VueJwtDecode.decode(payload).identity;
      state.role = VueJwtDecode.decode(payload).user_claims.role;
    }
  },
  getters: {
    session(state){
      var result = false;
      if (localStorage.token) {
        result = { role: state.role, username: state.username };
      }
      return result;
    }
  }
}