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
      if (status === 42 && !this.$store.getters["auth/is_refresh"]) {
        this.$store.commit("auth/set_refresh", true);
        const retry_request = new Promise(resolve => {
          console.log(this.$store.getters["auth/is_refresh"])
          this.refresh_token()
            .then(response => {
              console.log(1)
              this.save_token(response);
              var new_bearer = "Bearer " + localStorage.access_token;
              error.config.headers["Authorization"] = new_bearer;
              resolve(this.$http(error.config));
            })
            .catch(response => this.delete_tokens);
        });
        return retry_request;
      } else if (status === 42 && this.$store.getters["auth/is_refresh"]) {
        this.delete_tokens();
      } 
    });
  },
  methods: {
    refresh_token() {
      var refresh_bearer = "Bearer " + localStorage.refresh_token;
      const refresh_request = new Promise(resolve => {
        resolve(
          this.$http.get("refresh", {
            headers: { Authorization: refresh_bearer }
          })
        );
      });
      return refresh_request;
    },
    save_token(response) {
      localStorage.access_token = response.data.access_token;
      this.$store.commit("auth/update_session", response.data.access_token);
      this.$store.commit("auth/set_refresh", false);
    },
    delete_tokens(response) {
      delete localStorage.access_token;
      delete localStorage.refresh_token;
      this.$store.commit("auth/set_refresh", false);
    }
  }
};
</script>
