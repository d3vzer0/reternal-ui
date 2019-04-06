<template>
  <div id="recipe-overview">
    <b-row>
      <b-col id="recipe-agents" cols="2">
        <div class="card mapping-card-dark">
          <div class="card-header mapping-card-header">
            <font-awesome-icon icon="desktop" />
          </div>
          <div class="card-body mapping-card-body">
            <b-list-group>
              <b-list-group-item button v-for="agent in all_agents" 
                @click="click_agent_tile(agent)" :class="{active: is_selected(agent)}">
                {{agent.hostname}}
              </b-list-group-item>
            </b-list-group>
          </div>
        </div>
      </b-col>
      <b-col>
        <draggable v-model="task_commands" group="people" @start="drag=true" @end="drag=false">
          <transition-group>
            <div v-for="command in task_commands" :key="command.rand">
              <b-row>
                <b-col cols="8">
                  <b-card class="recipe-card" header-bg-variant="dark" header-text-variant="white" :header="command.name">
                    <b-list-group flush>
                      <b-list-group-item>
                        <b-row>
                          <b-col><b>Type</b></b-col>
                          <b-col>{{command.type}}</b-col>
                        </b-row>
                      </b-list-group-item>
                      <b-list-group-item v-if="command.type == 'Mitre'">
                        <b-row>
                          <b-col><b>Command</b></b-col>
                          <b-col>{{command.reference_name}}</b-col>
                        </b-row>
                      </b-list-group-item>
                      <b-list-group-item v-if="command.type == 'Mitre'">
                        <b-row>
                          <b-col><b>Technique</b></b-col>
                          <b-col>{{command.technique_name}}</b-col>
                        </b-row>
                      </b-list-group-item>
                      <b-list-group-item v-if="command.type == 'Mitre'">
                        <b-row>
                          <b-col><b>Phase</b></b-col>
                          <b-col>{{command.kill_chain_phase}}</b-col>
                        </b-row>
                      </b-list-group-item>

                      <b-list-group-item>
                        <b-row>
                          <b-col><b>Input</b></b-col>
                          <b-col>{{command.input}}</b-col>
                        </b-row>
                      </b-list-group-item>
                      <b-list-group-item>
                        <b-row>
                          <b-col><b-button variant="primary-reversed" class="fullwidth" @click="remove_command(command.rand)">Remove from recipe</b-button></b-col>
                        </b-row>
                      </b-list-group-item>
                    </b-list-group>
                  </b-card>
                </b-col>
                 <b-col offset="1" cols="1" class="command-seperator">
                  <div class="seperator-line">
                  </div>
                  <div class="seperator-circle">
                    <div class="seperator-time">
                      {{ command.sleep }}
                    </div>
                  </div>
                </b-col>
              </b-row>
            </div>
          </transition-group>
        </draggable>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

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
    }
  },
  computed: {
    all_agents: function () {
      return this.$store.getters["agents/get_agents"]
    },
    task_commands:  {
      get: function () {
        return this.$store.getters['task/commands']
      },
      set: function (value) {
        this.$store.commit('task/set_commands', value)
      }
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
    },
    click_agent_tile(agent_object) {
      console.log(1);
      this.$store.commit("selection/add_agent", agent_object);
    },
    is_selected(agent_object) {
      if (
        this.$store.getters["selection/get_agents"].includes(
          agent_object.beacon_id
        )
      ) {
        return true;
      }
    }
  },
  components: {
    draggable
  }
};
</script>

<style lang="scss" scoped>


.selectedcommand {
  background-color: #9d3a3a;
  color: white;
}

.recipe-card {
  word-break: break-all;
}
.mapping-card-dark {
  .mapping-card-body {
    padding: 0;
    .active {
      background-color: #00a5d69e;
      border-color: #f4f2f2;
    }
    .platform-select {
      border-radius: 0px;
    }
  }
  .mapping-card-header{
    border-radius: 0px;
    border: 2px;
    border-width: 3px;
    text-align: center;
    background-color: #343a40;
    color: #f4f2f2;
    font-size: 60px;
  }
}

</style>
