<template>
  <b-form-select :options="command_options" required v-model="command"/>
</template>

<script>
export default {
  name: "CommandsDropdown",
  data() {
    return {
      command_name: "",
      command_options: [],

      error: ""
    };
  },
  mounted() {
    this.get_commands();
  },
  computed: {
    command: {
      get: function() {
        return this.$store.getters["selection/command"];
      },
      set: function(value) {
        this.$store.commit("selection/change_command", value);
      }
    }
  },
  methods: {
    get_commands() {
      this.$http
        .get("commands")
        .then(response => this.parse_commands(response))
        .catch(response => this.generic_failed(response));
    },
    parse_commands(response) {
      var command_list = [];
      response.data.forEach(function(command) {
        var command_data = { value: command.name, text: command.name };
        command_list.push(command_data);
      });
      this.command_options = command_list;
    },
    generic_failed(response) {
      this.error = "Unable to perform request";
    }
  }
};
</script>
