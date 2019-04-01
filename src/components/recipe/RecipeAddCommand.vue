<template>
  <b-card header="Add manual command" header-tag="header" id="recipe-add-command">
    <b-form method="post" @submit.prevent="add_command">
      <b-row>
        <b-col cols="3">
          <b-form-select  required v-model="command">
            <optgroup label="Manual commands">
              <option v-for="command in command_options" :key="command.id" :value="command.value">{{command.text}}</option>
            </optgroup>
            <optgroup label="Macro commands">
              <option v-for="macro in macro_options" :key="macro.id" :value="macro.value">{{macro.text}}</option>
            </optgroup>
         </b-form-select>
        </b-col>
        <b-col cols="5">
         <b-form-input type="text" placeholder="Command input" v-model="input"></b-form-input>
        </b-col>
        <b-col cols="2">
          <b-form-input type="text" placeholder="Sleep" v-model="command_sleep"></b-form-input>
        </b-col>
        <b-col cols="2">
         <b-button type="submit" variant="primary" class="fullwidth">Add</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "RecipeAddCommand",
  data() {
    return {
      command_sleep: 0,
      command_options: [],
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
        var macro_data = { value: {name:macro.command, input:macro.input}, text: macro.name, id: macro._id['$oid'] };
        macro_list.push(macro_data)
      });
      this.macro_options = macro_list;
    },
    parse_commands(response) {
      var command_list = [];
      response.data.forEach(function(command) {
        var command_data = { value: {name:command.name}, text: command.name, id: command._id['$oid']};
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
    }
  }
};
</script>



<style lang="scss" scoped>
#recipe-add-command {
  height: 100%;
}

</style>