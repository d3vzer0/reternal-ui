<template>
  <div class="home top-10">
    <CommandsScheduler></CommandsScheduler>
  </div>
</template>

<script>
import CommandsScheduler from "@/components/CommandsScheduler";

export default {
  name: "Home",
  data(){
    return {
      selected_agents: this.$store.getters['selection/get_agents']
    }
  },
  methods: {
  },
  components: {
    CommandsScheduler
  }
  
};
</script>
