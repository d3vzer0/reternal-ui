export default {
  methods: {
    $getIntegrations () {
      this.$axios
        .get('/workers')
        .then(response => this.$getIntegrationsSuccess(response['data']))
    },
    $getIntegrationsSuccess (integrations) {
      this.$store.commit('integrations/setIntegrations', integrations)
    }
  }
}
