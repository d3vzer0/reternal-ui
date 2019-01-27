<template>
  <b-modal ref="changepass" id="changepass" size="md" hide-footer :title="'Change user: ' + username">
    <b-form method="post" @submit.prevent="change_user">
      <div class="alert alert-danger" v-if="error">{{ error }}</div>
      <b-row>
        <b-col>
          <b-form-input type="password" v-model="password" placeholder="New Password"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="top-10">
        <b-col>
          <b-form-input type="password" v-model="confirm_password" placeholder="Confirm New Password"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="top-10">
        <b-col>
          <b-form-select :options="role_options" v-model="role"/>
        </b-col>
      </b-row>
      <b-row class="top-10">
        <b-col> 
          <b-button type="submit" variant="primary" class="fullwidth">Change</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "ChangeUserModal",
  data() {
    return {
      error: false,
      username: "",
      password: "",
      confirm_password: "",
      role: "",
      role_options: ["User", "Admin"]
    };
  },
  mounted() {
    EventBus.$on("changeuser", user_data => {
      this.username = user_data.username;
      this.role = user_data.role;
      this.$refs.changepass.show();
    });
  },
  methods: {
    change_user() {
      var user_url = `user/${this.username}`;
      if (this.confirm_password === this.password ) {
        var post_data = {username:this.username, password:this.password, role:this.role}
        this.$http.post(user_url, post_data)
          .then(EventBus.$emit('changetaskfilter', ""), this.$refs.changepass.hide())
          .catch(error => this.error = error.response.data.data)
      }
    }
     
  },
  components: {}
};
</script>
