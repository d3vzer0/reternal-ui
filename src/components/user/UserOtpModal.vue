<template>
  <b-modal ref="userotp" id="userotp" size="md" hide-footer :title="'User OTP: ' + username">
    <div class="otpcode">
      <qrcode-vue :value="otp_value" :size="size" level="H"></qrcode-vue>
    </div>
  </b-modal>
</template>

<script>
import EventBus from "@/eventbus";
import QrcodeVue from "qrcode.vue";

export default {
  name: "ChangeUserModal",
  data() {
    return {
      otp_value: "",
      username: "",
      size: 300,
    };
  },
  created() {
    EventBus.$on("otpuser", username => this.show_otp(username));
  },
  methods: {
     show_otp(username){
      console.log(username)
      this.username = username;
      var user_url = `user/${username}`;
      this.$http.get(user_url)
        .then(response => this.otp_value = response.data.data, 
          this.$refs.userotp.show())
     }
  },
  components: {
    QrcodeVue
  }
};
</script>

<style lang="scss">
.otpcode {
  text-align: center;
}
</style>
