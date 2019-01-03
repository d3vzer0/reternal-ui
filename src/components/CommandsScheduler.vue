<template>
  <b-card header="command selection" header-tag="header">
    <p class="card-text">Add manual command to recipe</p>
    <b-form method="post" @submit.prevent="add_command">
      <b-row>
        <b-col cols="3">
        <CommandsDropdown></CommandsDropdown>
        </b-col>
        <b-col cols="5">
         <b-form-input type="text" placeholder="Command input" v-model="command_input"></b-form-input>
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
import CommandsDropdown from "@/components/CommandsDropdown";

export default {
  name: "CommandsCheduler",
  data(){
    return {
      command_name: "",
      command_input: "",
      command_sleep: 0,
      command_options: [
      ]
    }
  },
  methods: {
    add_command (){
      var random_array = new Uint32Array(5);
      var random_id = window.crypto.getRandomValues(random_array)[2];
      var command_options = {name: this.command_name, input: this.command_input, sleep: this.command_sleep, rand: random_id}
      this.$store.commit('task/add_command', command_options);
    }
  },
  components: {
    CommandsDropdown,
  }
  
};
</script>
