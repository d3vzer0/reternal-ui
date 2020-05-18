export default {
  methods: {
    $getSearchIntegrations () {
      this.$axios
        .get('/workers/search')
        .then(response => this.$getSearchIntegrationsSuccess(response['data']))
    },
    $getSearchIntegrationsSuccess (integrations) {
      this.$store.commit('searchIntegrations/setIntegrations', integrations)
    }
  }
}
