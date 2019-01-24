<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import createAuthRefreshInterceptor from "axios-auth-refresh";

export default {
  name: "BaseApp",
  created() {
    createAuthRefreshInterceptor(this.$http, this.refresh_access_token, {statusCodes: [ 401, 422 ]});
    this.$http.interceptors.request.use((config ) => {
      if (!("Authorization in config.headers")) {
        var auth_header = "Bearer " + this.$store.getters["auth/access_token"];
        config.headers["Authorization"] = auth_header;
      }
      return config
    })
   
  },
  methods: {
    refresh_access_token(original_request) {
      var refresh_header = "Bearer " + this.$store.getters["auth/refresh_token"];
      this.$http.get("refresh", {headers: { Authorization: refresh_header }})
        .then(refresh_response => {
          this.$store.commit("set_access_token", refresh_response.data.access_token);
          original_request.response.config.headers["Authorization"] = refresh_response.data.access_token;
          return Promise.resolve()
        })
        .catch(error => {
          if (error.response.status === 401 || error.response.status === 422) {
            this.$store.commit("auth/delete_access_token");
            this.$store.commit("auth/delete_refresh_token");
          }
        })
    }
  }
};
</script>
