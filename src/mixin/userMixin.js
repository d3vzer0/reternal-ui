import { oidcManager } from '../boot/auth.js'

export default {
  methods: {
    $getUserInfo () {
      oidcManager.getUser()
        .then(function (userData) {
          return userData
        })
    }
  }
}
