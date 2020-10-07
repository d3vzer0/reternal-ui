export default {
  methods: {
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
