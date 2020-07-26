import config from '../assets/config.json'
import Oidc from 'oidc-client'
import Vue from 'vue'

var oidcManager = new Oidc.UserManager({
  authority: config.oauth2.authority,
  client_id: config.oauth2.client_id,
  redirect_uri: config.oauth2.redirect_uri,
  response_type: config.oauth2.response_type,
  scope: config.oauth2.scope,
  automaticSilentRenew: true,
  filterProtocolClaims: true,
  loadUserInfo: false
})

Vue.prototype.$oauth = oidcManager
export { oidcManager }
