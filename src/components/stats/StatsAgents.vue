<template>
  <b-card class="agentcard" header="total agents" header-tag="header">
    <p class="agentcount">
      {{ agent_count }}
    </p>
  </b-card>
</template>

<script>
export default {
  name: "StatsAgent",
  data() {
    return {
      agent_count: 0
    };
  },
  mounted() {
    this.get_agent_count();
  },
  methods: {
    get_agent_count() {
      this.$http
        .get("stats/agents")
        .then(response => this.parse_agent_count(response))
        .catch(response => this.generic_failed(response));
    },
    parse_agent_count(response) {
      this.agent_count = response.data[0].beacon_count;
    }
  }
};
</script>

<style lang="sass">
.agentcard
  height: 230px
  font-size: 100px
  p
    text-align: center
</style>
