import store from '../store'
import moment from 'moment'

export function isAuthenticated () {
  var currentDate = moment().valueOf() / 1000
  if (process.env.DEV || (store.state.user.expires_at && store.state.user.expires_at > currentDate)) {
    return true
  } else {
    return false
  }
}
