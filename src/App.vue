<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "BaseApp",
  created() {
    this.$http.interceptors.response.use(undefined, error => {
      var status = error.response.data.sub_status;
      if (status === 42){
        if (this.$store.getters["auth/access_token"]) {
          this.$store.commit("auth/delete_access_token");
          const retry_request = new Promise(resolve => {
            this.refresh_token()
              .then(response => {
                this.$store.commit("auth/set_access_token", response.data.access_token);
                this.$store.commit("auth/set_claims", response.data.access_token)
                var new_bearer = "Bearer " + response.data.access_token;
                error.config.headers["Authorization"] = new_bearer;
                resolve(this.$http(error.config));
              })
            });
          return retry_request;
        } else {
          this.$store.commit("auth/delete_access_token");
          this.$store.commit("auth/delete_refresh_token");
        }
      }
    });
  },
  methods: {
    refresh_token() {
      var refresh_bearer = "Bearer " + this.$store.getters['auth/refresh_token'];
      const refresh_request = new Promise(resolve => {
        resolve(
          this.$http.get("refresh", {
            headers: { Authorization: refresh_bearer }
          })
        );
      });
      return refresh_request;
    }
  }
};
</script>
