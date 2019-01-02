<template>
  <b-form-select :options="command_options" required/>
</template>

<script>
export default {
  name: "CommandsDropdown",
  data(){
    return {
      command_options: [
      ],
   
      error: "",
    }
  },
  mounted () {
    this.get_commands()
  },
  methods: {
    get_commands (){
      this.$http
        .get('commands')
        .then(response => this.parse_commands(response))
        .catch(response => this.generic_failed(response))
    },
    parse_commands (response){
      var command_list = [];
      response.data.forEach(function(command){
        var command_data = {value:command._id["$oid"], text:command.name};
        command_list.push(command_data);
      });
      this.command_options = command_list;
    },
    generic_failed (response){
      this.error = "Unable to perform request";
    }
  }
};
</script>
