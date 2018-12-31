<template>
  <div class="agents top-10">
      <AgentTiles></AgentTiles>
  </div>
</template>

<script>
import AgentTiles from "@/components/AgentTiles";

export default {
  name: "Agents",
  data(){
    return {
    }
  },
  components: {
    AgentTiles
  }
  
};
</script>
