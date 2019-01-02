<template>
  <div class="home">
    <b-row class="top-10">
      <b-col cols="8">
       <CommandsScheduler></CommandsScheduler>
       </b-col>
       <b-col>
        <MitreScheduler></MitreScheduler>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
       <ExecutionPanel></ExecutionPanel>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CommandsScheduler from "@/components/CommandsScheduler";
import MitreScheduler from "@/components/MitreScheduler";
import ExecutionPanel from "@/views/ExecutionPanel";

export default {
  name: "Home",
  data(){
    return {
    
    }
  },
  methods: {
  },
  components: {
    CommandsScheduler,
    MitreScheduler,
    ExecutionPanel
  }
  
};
</script>
