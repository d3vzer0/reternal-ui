<template>
  <div class="home">
    <b-row class="top-10 headerstats">
      <b-col xl="4" lg="4">
        <StatsAgents></StatsAgents>
      </b-col>
      <b-col xl="4" lg="4">
        <StatsNew></StatsNew>
      </b-col>
      <b-col xl="4" lg="4">
        <StatsPlatform></StatsPlatform>
      </b-col>
    </b-row>
    <b-row class="top-10 mainstats">
      <b-col cols="12">
        <StatsPulse></StatsPulse>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import StatsPlatform from "@/components/stats/StatsPlatform"
import StatsAgents from "@/components/stats/StatsAgents"
import StatsPulse from "@/components/stats/StatsPulse"
import StatsNew from "@/components/stats/StatsNew"

export default {
  name: "Home",
  data(){
    return {
    
    }
  },
  methods: {
    testclick (){
      console.log(this.$store.getters['task/date'])
    }
  },
  components: {
    StatsPlatform,
    StatsAgents,
    StatsPulse,
    StatsNew
  }
  
};
</script>
<style lang="sass">

</style>
