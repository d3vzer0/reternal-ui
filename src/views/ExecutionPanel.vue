<template>
  <b-card-group>
    <b-card header="Type">
      <b-list-group flush>
        <b-list-group-item> Command </b-list-group-item>
        <b-list-group-item> Technique </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Command">
      <b-list-group flush>
        <b-list-group-item> exec_shell </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Input">
      <b-list-group flush>
        <b-list-group-item> Settings </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>
</template>

<script>

export default {
  name: "ExecutionPanel",
  data(){
    return {

    }
  },
  methods: {

  },
  components: {
  
  }
 
};
</script>

<style lang="sass">

.executerow
  .list-group-item
    border-radius: 0px
    &.active
      border-color: white
      background-color: #9d3a3a
  .card
    padding: 0px
  .card-body
    padding: 0px


</style>
