<template>
  <b-card-group class="mappingpanel">

    <b-card header="Phase" class="col-2">
      <b-list-group flush>
        <b-list-group-item  v-for="(phase, index) in phases_list" 
          @click="get_techniques(phase), selected_phase = phase, mapping_list = [], command_list = [], show_input = false"
          :key="index"
          :class="{'selectedphase': (phase == selected_phase)}">{{phase}}</b-list-group-item>
      </b-list-group>
    </b-card>

    <b-card header="Techniques" class="col-3">
      <b-list-group flush>
        <b-list-group-item v-for="(technique, index) in technique_list" 
          :key="index" 
          :class="{'selectedtechnique': (technique == selected_technique)}" 
          @click="get_mapping(technique), selected_technique = technique, command_list = [], show_input = false">
          {{technique}}
        </b-list-group-item>
      </b-list-group>
    </b-card> 

    <b-card header="Mapping" class="col-3">
      <b-list-group flush>
        <b-list-group-item v-for="(mapping, index) in mapping_list" 
          :key="index" 
          :class="{'selectedmapping': (mapping == selected_mapping)}" 
          @click="selected_mapping = mapping, command_list = mapping.commands, show_input = false">
          {{mapping.name}}
        </b-list-group-item>
      </b-list-group>
    </b-card> 

    <b-card header="Commands" class="col-3">
      <b-list-group flush>
        <b-list-group-item v-for="(command, index) in command_list" 
          :key="index"
          :class="{'selectedcommand': (index == selected_command)}"
           @click="selected_command = index,  command_type = command.name, command_input = command.input,
           show_input = true, command_sleep = command.sleep">
          {{command.name}}
        </b-list-group-item>
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
      search_technique: "",
      search_phase: "",
      search_platform: "Windows",
      search_name: "",

      phases_list: [],
      technique_list: [],
      mapping_list: [],
      command_list: [],
      selected_mapping: "",
      selected_phase: "",
      selected_technique: "",
      selected_command: "",

 
      command_input: "",
      command_sleep: 0,
      command_type: "",
      show_input: false,
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
        .get("mapping", {
          params: {
            name: this.search_technique,
            phase: this.search_phase,
            platform: this.search_platform,
            distinct: "kill_chain_phase"
          }
        })
        .then(response => this.phases_list = response.data)
        .catch(error => EventBus.$emit("showalert", error.response));
    }, 200),
    get_techniques(phase) {

      this.$http
        .get("mapping", {
          params: {
            name: this.search_technique,
            phase: phase,
            platform: this.search_platform,
            distinct: "technique_name"
          }
        })
        .then(response => this.technique_list = response.data)
        .catch(response => this.generic_failed(response));
    },
    get_mapping(technique) {
      this.$http
        .get("mapping", {
          params: {
            name: this.search_name,
            phase: this.selected_phase,
            platform: this.search_platform,
            technique: technique
          }
        })
        .then(response => this.mapping_list = response.data)
        .catch(response => this.generic_failed(response));
    },
    change_filters(filters) {
      this.search_technique = filters.technique;
      this.search_platform = filters.platform;
      this.search_phase = filters.phase;
      this.get_mapping_filtered();
    },

    add_to_recipe() {
      this.command_list.forEach(command => {
        var random_array = new Uint32Array(5);
        var random_id = window.crypto.getRandomValues(random_array)[2];
        var command_options = {
          reference_name: this.selected_mapping.name,
          reference_id: this.selected_mapping._id['$oid'],
          technique_name: this.selected_mapping.technique_name,
          kill_chain_phase: this.selected_mapping.kill_chain_phase,
          technique_id: this.selected_mapping.technique_id,
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

<style lang="scss" scoped>
.addrecipecol {
  background-color: #9d3a3a;
  text-transform: uppercase;
  a {
    color: white;
    text-decoration: none;
  }
} 

.selectedtechnique {
  background-color: #9d3a3a;
  color: white;
}

.selectedphase {
  background-color: #9d3a3a;
  color: white;
}

.selectedcommand {
  background-color: #9d3a3a;
  color: white;
}

.selectedmapping {
  background-color: #9d3a3a;
  color: white;
}

.mappingpanel {
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
