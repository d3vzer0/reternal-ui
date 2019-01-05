<template>
  <div class="agents">
    <b-row class="top-10">
      <b-col cols="12">
        <AgentFilter></AgentFilter>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
        <AgentOverview></AgentOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// import AgentTiles from "@/components/AgentTiles";
import AgentFilter from "@/components/agent/AgentFilter";
import AgentOverview from "@/components/agent/AgentOverview";

export default {
  name: "Agents",
  data(){
    return {
      agent_list: [],
    }
  },
  components: {
    AgentFilter,
    AgentOverview
  }
  
};
</script>
