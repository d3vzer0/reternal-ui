<template>
  <div class="home">
    <b-row class="top-10">
    </b-row>
  </div>
</template>

<script>

export default {
  name: "Home",
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

  }
  
};
</script>
