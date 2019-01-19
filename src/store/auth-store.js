import VueJwtDecode from "vue-jwt-decode";

export default {
  namespaced: true,
  state: {
    access_token: localStorage.access_token || "",
    refresh_token: localStorage.refresh_token || "",
    username: "",
    is_refresh: false,
    role: ""
  },
  mutations: {
    update_session(state, payload) {
      state.username = VueJwtDecode.decode(payload).identity;
      state.role = VueJwtDecode.decode(payload).user_claims.role;
    },
    set_refresh(state, payload) {
      state.is_refresh = payload;
    }
  },
  getters: {
    session(state) {
      var result = false;
      console.log(localStorage.access_token)
      if (localStorage.refresh_token && localStorage.access_token) {
        result = { role: state.role, username: state.username };
      }
      return result;
    },
    is_refresh(state) {
      return state.is_refresh;
    }
  }
};
