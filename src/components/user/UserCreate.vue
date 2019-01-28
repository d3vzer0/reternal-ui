<template>

  <b-card header="create user" header-tag="header">
    <p class="card-text">Create a new user</p>
      <b-form method="post" @submit.prevent="create_user">
        <b-row>
          <b-col >
            <b-form-input type="text" v-model="username" placeholder="Username" required></b-form-input>
          </b-col>
          <b-col >
            <b-form-input type="password" v-model="password" placeholder="Password" required></b-form-input>
          </b-col>
          <b-col>
            <b-form-input type="password" v-model="confirm_password" placeholder="Confirm Password" required></b-form-input>
          </b-col>
          <b-col cols="2">
            <b-form-select :options="role_options" required v-model="role"/>
          </b-col>
          <b-col cols="1"> 
            <b-button type="submit" variant="primary" class="fullwidth">Create</b-button>
          </b-col>
        </b-row>
    </b-form>
  </b-card>

</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "UserCreate",
  data() {
    return {
      username: "",
      password: "",
      confirm_password: "",
      role: "",
      role_options: ["User", "Admin"]
    };
  },
  methods: {
    create_user(){
      if (this.confirm_password === this.password ) {
        var post_data = {username:this.username, password:this.password, role:this.role}
        this.$http.post("users", post_data)
          .then(response => EventBus.$emit('changetaskfilter', ""), EventBus.$emit('otpuser', this.username))
      }
    }
  }
};
</script>
