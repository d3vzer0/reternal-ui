<template>
  <b-card-group class="startuppanel">
    <b-card header="Task" class="col-3">
      <b-list-group flush>
        <b-list-group-item v-for="startup in startup_list" v-on:click="command_list = startup.commands">
          <b-row>
            <b-col cols="8">
              {{startup.name}} 
            </b-col>
            <b-col>
              <b-badge>delete</b-badge>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Command" class="col-3">
      <b-list-group flush>
        <b-list-group-item v-for="command in command_list" v-on:click="command_data = command">
          {{command.name}}
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Input">
      <b-list-group flush>
        <b-list-group-item>
          <b-row>
            <b-col><b>Type</b></b-col>
            <b-col>{{this.command_data.type}}</b-col>
          </b-row>  
        </b-list-group-item>
         <b-list-group-item>
          <b-row>
            <b-col><b>Input</b></b-col>
            <b-col>{{this.command_data.input}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Sleep</b></b-col>
            <b-col>{{this.command_data.sleep}}</b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "StartupOverview",
  data(){
    return {
      startup_list: [],
      command_list: [],
      command_data: {},
      defaults: {
        platform:"Windows",
        input:""
      }
    }
  },
  mounted (){
    EventBus.$on('getstartup', filter =>{
      this.get_startup_filtered(filter);
    }),
    this.get_startup_filtered(this.defaults);
  },
  methods: {
    get_startup_filtered(filters){
      this.$http
        .get('startuptasks', {params:{platform: filters.platform}})
        .then(response => this.startup_success(response))
        // .catch(error => EventBus.$emit('showalert', error.response))
    },
    startup_success (response){
      this.startup_list = response.data;
    },
    remove_startup(command_rand){
      this.$store.commit('task/remove_command', command_rand);
      this.task_commands = this.$store.getters['task/commands'];
      this.show_details_panel = false;
    }
  },
  components: {
  
  }
 
};
</script>

<style lang="sass">

.startuppanel
  .list-group-item
    border-radius: 0px
    &.active
      border-color: white
      background-color: #9d3a3a
      .badge
        background-color: white
        color: black
  .card
    padding: 0px
  .card-body
    padding: 0px
  .badge
    background-color: #9d3a3a


</style>
