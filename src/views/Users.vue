<template>
  <div class="users">
    <div class="usercreate top-10">
      <user-create></user-create>
    </div>
    <div clas="useroverview top-10">
      <user-overview></user-overview>
    </div>
  </div>
</template>

<script>
import UserCreate from "@/components/user/UserCreate";
import UserOverview from "@/components/user/UserOverview";
import EventBus from "@/eventbus";


export default {
  name: "Users",
  data() {
    return {
    };
  },
  
  components: {
    UserCreate,
    UserOverview
 
  },
};
</script>

<style lang="scss">

</style>
