export function getToken (state) {
  return state.access_token
}

export function getProfile (state) {
  return {
    profile: {
      email: 'dev@reternal.local',
      email_verified: '',
      name: 'Developer',
      nickname: 'Developer',
      picture: '',
      sub: '',
      updated_at: ''
    },
    scope: '',
    id_token: '',
    expires_at: '',
    access_token: ''
  }
}
