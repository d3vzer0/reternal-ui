<template>
  <b-card-group class="executionpanel">
    <b-card header="Phase" class="col-2">
      <b-list-group flush>
        <b-list-group-item  v-for="mapping_phase in mapping_phases" @click="show_phase_techniques(mapping_phase)">{{mapping_phase._id.kill_chain_phase}}</b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Techniques" class="col-3">
      <b-list-group flush>
        <b-list-group-item  v-for="mapping_technique in mapping_techniques" @click="get_technique_commands(mapping_technique._id['$oid'])">
          {{mapping_technique.name}}
        </b-list-group-item>
      </b-list-group>
    </b-card>
     <b-card header="Commands" class="col-2">
      <b-list-group flush v-if="show_commands">
        <b-list-group-item  v-for="mapping_command in mapping_commands" @click="show_command_details(mapping_command)">{{mapping_command.name}}</b-list-group-item>
        <b-list-group-item class="addrecipecol"><b-link to="mapping" @click="add_to_recipe">add commands to recipe</b-link></b-list-group-item>

      </b-list-group>
    </b-card>
    <b-card header="Input" class="col-5">
      <b-list-group flush v-if="show_input">
        <b-list-group-item>
          <b-row>
            <b-col><b>Type</b></b-col>
            <b-col>{{command_type}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Input</b></b-col>
            <b-col>{{command_input}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Sleep</b></b-col>
            <b-col>{{command_sleep}}</b-col>
          </b-row>
        </b-list-group-item>

      </b-list-group>
    </b-card>
  </b-card-group>

</template>

<script>
import _ from "lodash";
import EventBus from "@/eventbus";

export default {
  name: "MappingOverview",
  data() {
    return {
      mapping_phases: [],
      mapping_techniques: [],
      mapping_commands: [],
      show_commands: false,
      show_input: false,
      command_input: "",
      command_sleep: 0,
      command_type: "",
      search_technique: "",
      search_phase: "",
      search_platform: "Windows",
      mapping_id: "",
      mapping_name: ""
    };
  },
  created() {
    EventBus.$on("refreshmapping", filters => {
      this.change_filters(filters);
    });
  },
  mounted() {
    this.get_mapping_filtered();
  },
  methods: {
    get_mapping_filtered: _.debounce(function() {
      this.$http
        .get("mitre/mapping", {
          params: {
            name: this.search_technique,
            phase: this.search_phase,
            platform: this.search_platform
          }
        })
        .then(response => this.parse_mapping(response))
        .catch(error => EventBus.$emit("showalert", error.response));
    }, 200),
    get_technique_commands(mapping_id) {
      var map_url = `mitre/mapping/${mapping_id}`;
      this.$http
        .get(map_url)
        .then(response => this.parse_technique_commands(response))
        .catch(response => this.generic_failed(response));
    },
    parse_mapping(response) {
      this.mapping_phases = response.data;
    },
    parse_technique_commands(response) {
      this.show_commands = true;
      this.show_input = false;
      this.mapping_commands = response.data.commands;
    },
    generic_failed(response) {
      this.error = "Unable to perform request";
    },
    change_filters(filters) {
      this.search_technique = filters.technique;
      this.search_platform = filters.platform;
      this.search_phase = filters.phase;
      this.get_mapping_filtered();
    },
    show_phase_techniques(mapping) {
      this.show_commands = false;
      this.show_input = false;
      this.mapping_techniques = mapping.techniques;
    },
    show_command_details(command) {
      this.show_commands = true;
      this.show_input = true;
      this.command_input = command.input;
      this.command_sleep = command.sleep;
      this.command_type = command.type;
    },
    add_to_recipe() {
      this.mapping_commands.forEach(command => {
        var random_array = new Uint32Array(5);
        var random_id = window.crypto.getRandomValues(random_array)[2];
        var command_options = {
          name: command.name,
          input: command.input,
          sleep: command.sleep,
          rand: random_id,
          type: command.type
        };
        this.$store.commit("task/add_command", command_options);
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.addrecipecol
  background-color: #9d3a3a
  text-transform: uppercase
  a
    color: white
    text-decoration: none 
</style>
