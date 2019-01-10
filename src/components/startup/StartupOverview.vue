<template>
  <b-card-group class="startuppanel">
    <b-card header="Task" class="col-3">
      <b-list-group flush>
        <b-list-group-item v-for="startup in startup_list">
          <b-row>
            <b-col cols="8" @click="command_list = startup.commands, show_commands = true, show_input = false">
              {{startup.name}} 
            </b-col>
            <b-col>
              <b-badge href="#" @click="delete_startup(startup._id['$oid'])">DELETE</b-badge>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Command" class="col-3">
      <b-list-group flush v-if="show_commands">
        <b-list-group-item v-for="command in command_list" @click="command_data = command, show_input = true">
          {{command.name}}
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Input">
      <b-list-group flush v-if="show_input">
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
  data() {
    return {
      startup_list: [],
      command_list: [],
      command_data: {},
      show_commands: false,
      show_input: false,
      defaults: {
        platform: "Windows",
        input: ""
      }
    };
  },
  mounted() {
    EventBus.$on("getstartup", filter => {
      this.get_startup_filtered(filter);
    }),
      this.get_startup_filtered(this.defaults);
  },
  methods: {
    get_startup_filtered(filters) {
      this.show_input = false;
      this.show_commands = false;
      this.$http
        .get("startuptasks", { params: { platform: filters.platform } })
        .then(response => this.startup_success(response))
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    startup_success(response) {
      this.startup_list = response.data;
    },
    delete_startup(startup_id) {
      var delete_url = `startuptask/${startup_id}`;
      this.$http
        .delete(delete_url)
        .then(response => this.get_startup_filtered(this.defaults))
        .catch(error => EventBus.$emit("showalert", error.response));
    }
  }
};
</script>

<style lang="scss" scoped>

.startuppanel {
  .list-group-item {
    border-radius: 0px;
    &.active {
      border-color: white;
      background-color: #9d3a3a;
      .badge {
        background-color: white;
        color: black;
      }
    }
  }
  .card {
    padding: 0px;
  }
  .card-body {
    padding: 0px;
  }
  .badge {
    background-color: #9d3a3a;
  }
}


</style>
