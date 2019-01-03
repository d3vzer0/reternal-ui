<template>
  <div class="home">
    <b-row class="top-10">
      <b-col cols="5">
        <DateTimeCard></DateTimeCard>
      </b-col>
      <b-col cols="7">
        <b-row>
          <b-col>
            <CommandsScheduler></CommandsScheduler>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
            <MitreScheduler></MitreScheduler>
          </b-col>
        </b-row>
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
import ExecutionPanel from "@/components/ExecutionPanel";
import DateTimeCard from "@/components/DateTimeCard";

export default {
  name: "Recipe",
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
    CommandsScheduler,
    MitreScheduler,
    ExecutionPanel,
    DateTimeCard
  }
  
};
</script>
