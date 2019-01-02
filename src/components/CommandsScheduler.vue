<template>
  <b-card header="command selection" header-tag="header">
    <p class="card-text">Add manual command to task</p>
    <b-form method="post" @submit.prevent="submit_task">
      <b-row>
        <b-col cols="3">
        <CommandsDropdown></CommandsDropdown>
        </b-col>
        <b-col cols="5">
         <b-form-input type="text" placeholder="Command input"></b-form-input>
        </b-col>
        <b-col cols="2">
          <b-form-input type="text" placeholder="Sleep"></b-form-input>
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
      command_options: [
      ]
    }
  },
  components: {
    CommandsDropdown,
  }
  
};
</script>
