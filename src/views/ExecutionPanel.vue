<template>
  <b-card-group class="executionpanel">
    <b-card header="Type" class="col-2">
      <b-list-group flush>
        <b-list-group-item> Command </b-list-group-item>
        <b-list-group-item> Technique </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Command" class="col-4">
      <b-list-group flush>
        <b-list-group-item> exec_shell </b-list-group-item>
        <b-list-group-item> exec_shell </b-list-group-item>
        <b-list-group-item> exec_shell </b-list-group-item>
        <b-list-group-item> exec_shell </b-list-group-item>
        <b-list-group-item> exec_shell </b-list-group-item>

      </b-list-group>
    </b-card>
    <b-card header="Input">
      <b-list-group flush>
        <b-list-group-item>
          <b-row>
            <b-col><b>Input</b></b-col>
            <b-col>cat /etc/passwd</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Sleep</b></b-col>
            <b-col>5</b-col>
          </b-row>
        </b-list-group-item>
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

.executionpanel
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
