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
  data () {
    return {
      agent_count: 0
    }
  },
  methods: {
     get_platforms (){
      this.$http
        .get('stats/agents')
        .then(response => this.parse_platforms(response))
        .catch(response => this.generic_failed(response))
    },
    parse_platforms (response){
        var a = "a";
    }
  }
}
</script>

<style lang="sass">
.agentcard
  height: 230px
  font-size: 100px
  p
    text-align: center
</style>
