<template>
  <b-row>
      <b-col>
      <b-card header="command selection" header-tag="header">
          <p class="card-text">Select command to issue to agent(s)</p>
          <b-form method="post" @submit.prevent="submit_task">
          <b-row>
              <b-col cols="3">
              <CommandsDropdown></CommandsDropdown>
              </b-col>
              <b-col cols="7">
              <b-form-input type="text" placeholder="Command input"></b-form-input>
              </b-col>
              <b-col cols="2">
              <b-button type="submit" variant="primary" class="fullwidth">Submit</b-button>
              </b-col>
          </b-row>
          </b-form>
      </b-card>
      </b-col>
  </b-row>
</template>

<script>
import CommandsDropdown from "@/components/CommandsDropdown";
export default {
  name: "CommandsScheduler",
  data(){
    return {
      command_options: [
      ]
    }
  },
  components: {
    CommandsDropdown,
  }
  
};
</script>
