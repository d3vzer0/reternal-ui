<template>

  <b-card header="create macro" header-tag="header">
    <p class="card-text">Create custom macros based on existing/default commands</p>
    <b-form method="post" @submit.prevent="create_macro">
      <b-row>
          <b-col cols="2">
            <CommandsDropdown></CommandsDropdown>
          </b-col>
          <b-col cols="2">
            <b-form-input type="text" placeholder="Alias name" v-model="create_alias_name" required></b-form-input>
          </b-col>
          <b-col cols="6">
            <b-form-input type="text" placeholder="Command input" v-model="create_alias_input" required></b-form-input>
          </b-col>
          <b-col cols="2">
            <b-button type="submit" variant="primary" class="fullwidth">Submit</b-button>
          </b-col>
      </b-row>
    </b-form>
  </b-card>

</template>

<script>
import CommandsDropdown from "@/components/commands/CommandsDropdown";
import EventBus from "@/eventbus";

export default {
  name: "MacroCreate",
  data(){
    return {
      create_alias_name: "",
      create_alias_input: "",
    }
  },
  methods: {
    create_macro(){
      var selected_command = this.$store.getters['selection/command'];
      this.$http
        .post('macros', {command: selected_command, name: this.create_alias_name, input:this.create_alias_input})
        .then(response => this.create_success(response))
        .catch(response => this.generic_failed(response))
    },
    create_success(response){
      EventBus.$emit('refreshmacros');
    }
  },
  components: {
    CommandsDropdown
  }
  
};
</script>
