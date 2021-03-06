import config from '../assets/config.json'

export default {
  methods: {
    $isC2Enabled () {
      return config.c2
    },
    $isSearchEnabled () {
      return config.search
    },
    $getIntegrations () {
      this.$axios
        .get('/workers/c2')
    },
    $getIntegrationsResults (uuid) {
      this.$axios
        .get('/workers/c2/' + uuid)
        .then(response => this.$getIntegrationsSuccess(response['data']))
    },
    $getIntegrationsSuccess (integrations) {
      this.$store.commit('integrations/setIntegrations', integrations)
    }
  }
}
