export default {
  methods: {
    $getAgents () {
      for (var integration in this.$store.state.integrations.integrationOptions) {
        this.$axios
          .get('/agents/' + integration)
          .then(response => this.$getAgentsSuccess(response['data']))
      }
    },
    $getAgentsSuccess (agents) {
      this.$store.commit('agents/setOptions', agents)
    }
  }
}
