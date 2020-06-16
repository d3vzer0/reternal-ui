export function setUser (state, user) {
  state.profile.email = user.profile.email
  state.profile.name = user.profile.name
  state.profile.email_verified = user.profile.email_verified
  state.profile.nickname = user.profile.nickname
  state.profile.picture = user.profile.picture
  state.profile.updated_at = user.profile.updated_at
  state.profile.sub = user.profile.sub
  state.access_token = user.access_token
  state.id_token = user.id_token
  state.expires_at = user.expires_at
  state.scope = user.scope
}
