<template>
  <div class="home top-10">
    <CommandsScheduler></CommandsScheduler>
    <MitreOverview></MitreOverview>
  </div>
</template>

<script>
import MitreOverview from "@/components/MitreOverview";
import CommandsScheduler from "@/components/CommandsScheduler";

export default {
  name: "Home",
  data(){
    return {
    }
  },
  components: {
    MitreOverview,
    CommandsScheduler
  }
  
};
</script>
