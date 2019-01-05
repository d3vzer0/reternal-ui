<template>
  <div class="startup">
    <b-row class="top-10">
      <b-col cols="12">
       <StartupFilter></StartupFilter>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
       <StartupOverview></StartupOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import StartupOverview from "@/components/startup/StartupOverview";
import StartupFilter from "@/components/startup/StartupFilter";

export default {
  name: "Startup",
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
    StartupOverview,
    StartupFilter
  }
  
};
</script>
