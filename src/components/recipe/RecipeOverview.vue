<template>
  <b-card-group class="executionpanel">
    <b-card header="Command" class="col-4">
      <b-list-group flush v-if="show_commands_card">
        <b-list-group-item v-for="command in task_commands" 
        :key="command.rand" 
        :class="{'selectedcommand': (command.rand == selected_command_rand)}"  @click="show_command_details(command)">
          <p v-if="command.type == 'Mitre'">{{command.reference_name}}</p>
          <p v-if="command.type == 'Manual'">{{command.name}}</p>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Input">
      <b-list-group flush v-if="show_details_panel">
        <b-list-group-item>
          <b-row>
            <b-col><b>Type</b></b-col>
            <b-col>{{selected_command_type}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item v-if="selected_command_type == 'Mitre'">
          <b-row>
            <b-col><b>Command</b></b-col>
            <b-col>{{selected_command}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item v-if="selected_command_type == 'Mitre'">
          <b-row>
            <b-col><b>Technique</b></b-col>
            <b-col>{{selected_mitre_name}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item v-if="selected_command_type == 'Mitre'">
          <b-row>
            <b-col><b>Phase</b></b-col>
            <b-col>{{selected_mitre_phase}}</b-col>
          </b-row>
        </b-list-group-item>

        <b-list-group-item>
          <b-row>
            <b-col><b>Input</b></b-col>
            <b-col>{{selected_command_input}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Sleep</b></b-col>
            <b-col>{{selected_command_sleep}}</b-col>
          </b-row>
        </b-list-group-item>
         <b-list-group-item>
          <b-row>
            <b-col><b-button variant="primary-reversed" class="fullwidth" @click="remove_command(selected_command_rand)">Remove from recipe</b-button></b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>
</template>

<script>
export default {
  name: "ExecutionPanel",
  data() {
    return {
      show_details_panel: false,
      show_commands_card: true,
      show_techniques_card: false,
      selected_command: "",
      selected_command_type: "",
      selected_command_input: "",
      selected_command_sleep: 0,
      selected_command_rand: 0,
      selected_mitre_name: "",
      selected_mitre_phase: "",
      reference_name: "",
      task_commands: this.$store.getters["task/commands"]
    }
  },
  methods: {
    show_command_details(command) {
      this.selected_command = command.name;
      this.selected_command_input = command.input;
      this.selected_command_sleep = command.sleep;
      this.selected_command_rand = command.rand;
      this.selected_command_type = command.type;
      if (command.type === "Mitre"){
        this.selected_mitre_name = command.technique_name;
        this.selected_mitre_phase = command.kill_chain_phase;
        this.reference_name = command.reference_name;

      }
      this.show_details_panel = true;
    },
    remove_command(command_rand) {
      this.$store.commit("task/remove_command", command_rand);
      this.task_commands = this.$store.getters["task/commands"];
      this.show_details_panel = false;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>

.selectedcommand {
  background-color: #9d3a3a;
  color: white;
}

.executionpanel {
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
