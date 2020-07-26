import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import Vue from 'vue'
import config from '../assets/config.json'

export default {
  methods: {
    $setSocket (accessToken) {
      const socket = io(config.socketio, {
        autoConnect: false,
        transportOptions: {
          polling: {
            extraHeaders: {
              'Authorization': 'Bearer ' + accessToken
            }
          }
        }
      })
      Vue.use(VueSocketIOExt, socket)
    }
  }
}
