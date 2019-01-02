<template>
  <div class="agents">
    <b-row class="top-10">
      <b-col cols="12">
        <AgentFilter></AgentFilter>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
        <AgentTiles></AgentTiles>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// import AgentTiles from "@/components/AgentTiles";
import AgentFilter from "@/components/AgentFilter";
import AgentTiles from "@/components/AgentTiles";

export default {
  name: "Agents",
  data(){
    return {
      agent_list: [],
    }
  },
  components: {
    AgentFilter,
    AgentTiles
  }
  
};
</script>
