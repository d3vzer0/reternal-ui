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
    }
  },
  components: {
    CommandsScheduler
  }
  
};
</script>
