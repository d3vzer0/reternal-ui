export default {
  methods: {
    $getIntegrations () {
      this.$axios
        .get('/workers')
    },
    $getIntegrationsResults (uuid) {
      this.$axios
        .get('/workers/search/' + uuid)
        .then(response => this.$getIntegrationsSuccess(response['data']))
    },
    $getIntegrationsSuccess (integrations) {
      this.$store.commit('integrations/setIntegrations', integrations)
    }
  }
}
