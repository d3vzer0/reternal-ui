<template>
  <b-container fluid>
    <b-row class="justify-content-md-center top-50">
      <b-col cols="3" md="4" class="center-block">
        <b-card header="Authentication" header-tag="header" id="card-login">
          <div id="card-login-header">
            <div class="alert alert-danger" v-if="error">{{ error }}</div>
          </div>
          <b-form method="post" @submit.prevent="login">
            <b-row>
              <b-col cols="12" class="top-10">
                <b-form-input type="text" v-model="username" required placeholder="Username"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" class="top-10">
                <b-form-input type="password" v-model="password" required placeholder="Password"></b-form-input>
              </b-col>
            </b-row>
            <b-row>
              <b-col cols="12" class="top-10">
                <b-button type="submit" variant="primary" class="fullwidth">Submit</b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      error: false
    };
  },
  methods: {
    login() {
      this.$http
        .post("login", { username: this.username, password: this.password })
        .then(response => this.login_success(response))
        .catch(response => this.login_failed(response));
    },
    login_success(response) {
      if (!response.data.access_token) {
        this.login_failed();
        return;
      }
      localStorage.access_token = response.data.access_token;
      localStorage.refresh_token = response.data.refresh_token;
      this.$store.commit("auth/update_session", response.data.access_token);
      this.$router.replace(this.$route.query.redirect || "/home");
    },
    login_failed(response) {
      this.error = "Unable to login";
      this.$store.commit("auth/set_refresh", false);
      delete localStorage.access_token;
      delete localStorage.refresh_token;
    }
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
@import "@/assets/style.scss";

body {
  background-color: #eeeeee;
}

#header-image {
  width: 100%;
}

#card-login {
  #sidebar-header-image {
    width: 80%;
  }
}
  
#app {
  font-family: 'Open Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
