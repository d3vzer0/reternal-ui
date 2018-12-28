export default {
  namespaced: true,
  state: {
    error_message: false,
    error_seconds: 5,
    error_countdown: 0
  },
  actions: {
    countdown_changed(error_countdown){
      this.error_countdown = error_countdown;
    },
    display_error (){
      this.error_countdown = this.error_seconds;
    }
  },
  mutations: {
    update_error(error_message){
      self.error_message = error_message;
    }
  }
}