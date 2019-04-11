<template>
  <b-row class="justify-content-center">
    <b-form method="post" @submit.prevent="add_command" id="add-command">
    </b-form>
     <b-col cols="2">
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           <font-awesome-icon icon="terminal" />
        </div>
        <div class="card-body mapping-card-body">
          <b-form-select required v-model="command" form="add-command">
            <optgroup label="Manual commands">
              <option v-for="command in command_options" :key="command.id" :value="command.value">{{command.text}}</option>
            </optgroup>
            <optgroup label="Macro commands">
              <option v-for="macro in macro_options" :key="macro.id" :value="macro.value">{{macro.text}}</option>
            </optgroup>
         </b-form-select>
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           <font-awesome-icon icon="keyboard" />
        </div>
        <div class="card-body mapping-card-body">
          <b-form-input v-if="command.input_type == 'text' || command.input" type="text" placeholder="Command input" v-model="input" form="add-command"></b-form-input>
          <b-form-input v-if="command.input_type == 'none'" disabled type="text" placeholder="Command does not accept input"></b-form-input>
          <b-form-select v-if="command.input_type == 'agent'" form="add-command" v-model="input">
            <option v-for="agent in all_agents" :key="agent.beacon_id" :value="agent.beacon_id">{{agent.hostname}}</option>
          </b-form-select>
        </div>
      </div>
    </b-col>
    <b-col cols="2">
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           <font-awesome-icon icon="clock" />
        </div>
        <div class="card-body mapping-card-body">
          <b-form-input type="text" placeholder="Sleep" v-model="command_sleep" form="add-command"></b-form-input>
        </div>
      </div>
    </b-col>
    <b-col cols="2">
      <div class="card mapping-card mapping-card-button">
        <div class="card-header mapping-card-header">
         <font-awesome-icon icon="plus" />
        </div>
        <div class="card-body mapping-card-body">
          <b-button type="submit" variant="transparant" class="fullwidth" form="add-command">Add to recipe</b-button> 
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "RecipeAddCommand",
  data() {
    return {
      command_sleep: 0,
      command_options: [],
      default_commands: {},
      macro_options: [],
    };
  },
  mounted (){
    this.get_commands(), this.get_macros();
  },
  methods: {
    add_command() {
      var random_array = new Uint32Array(5);
      var random_id = window.crypto.getRandomValues(random_array)[2];
      var command_options = {
        name: this.$store.getters["selection/command"]["name"],
        input: this.$store.getters["selection/input"],
        sleep: this.command_sleep,
        rand: random_id,
        type: "Manual"
      };
      this.$store.commit("task/add_command", command_options);
    },
    get_commands() {
      this.$http
        .get("commands")
        .then(response => this.parse_commands(response))
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    get_macros() {
      this.$http
        .get("macros")
        .then(response => this.parse_macros(response))
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    parse_macros(response) {
      var macro_list = [];
      response.data.forEach(function(macro) {
        var macro_data = { value: {name:macro.command, input:macro.input},
          text: macro.name, id: macro._id['$oid'] };
        macro_list.push(macro_data)
      });
      this.macro_options = macro_list;
    },
    parse_commands(response) {
      var command_list = [];
      response.data.forEach(function(command) {
        var command_data = { value: {name:command.name, input_type:command.input_type,
          input_values:command.input_values}, text: command.name, id: command._id['$oid']};
        command_list.push(command_data);
      });
      this.command_options = command_list;
    }
  },
  computed: {
    command: {
      get: function() {
        return this.$store.getters["selection/command"];
      },
      set: function(value) {
        this.$store.commit("selection/change_command", value);
      }
    },
    input: {
      get: function() {
        return this.$store.getters["selection/input"];
      },
      set: function(value) {
        this.$store.commit("selection/change_input", value);
      }
    },
     all_agents: function () {
      return this.$store.getters["agents/get_agents"]
    }
  }
};
</script>



<style lang="scss" scoped>
#recipe-add-command {
  height: 85%;
}

</style>