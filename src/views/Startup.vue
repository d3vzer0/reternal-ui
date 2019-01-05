<template>
  <div class="startup">
    <b-row class="top-10">
      <b-col cols="12">
       <StartupFilter></StartupFilter>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
       <StartupPanel></StartupPanel>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import StartupPanel from "@/components/StartupPanel";
import StartupFilter from "@/components/StartupFilter";

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
    StartupPanel,
    StartupFilter
  }
  
};
</script>
