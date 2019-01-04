<template>

  <b-card-group class="executionpanel">
    <b-card header="Macros" class="col-4">
      <b-list-group flush>
        <b-list-group-item v-for="macro in macro_list" v-on:click="show_macro_details(macro)">{{macro.name}}</b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Input">
      <b-list-group flush v-if="show_details_panel">
        <b-list-group-item>
          <b-row>
            <b-col><b>Command</b></b-col>
            <b-col>{{macro_command}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Input</b></b-col>
            <b-col>{{macro_input}}</b-col>
          </b-row>
        </b-list-group-item>
         <b-list-group-item>
          <b-row>
            <b-col><b-button variant="primary-reversed" class="fullwidth" v-on:click="remove_macro(selected_command_rand)">Remove macro</b-button></b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>


</template>

<script>
import { EventBus } from "@/eventbus/eventbus.js";

export default {
  name: "MacroOverview",
  data(){
    return {
      macro_list: [],
      macro_id: "",
      macro_input: "",
      macro_command: "",
      show_details_panel: false,
    }
  },
  mounted (){
    this.get_macros(),
    EventBus.$on('refresh-macros', this.get_macros);

  },
  methods: {
     get_macros (){
      this.$http
        .get('macros')
        .then(response => this.parse_macros(response))
        .catch(response => this.generic_failed(response))
    },
    parse_macros(response){
      this.macro_list = response.data
    },
    show_macro_details (macro){
      this.macro_id = macro["_id"]["$oid"];
      this.macro_command = macro.command;
      this.macro_input = macro.input;
      this.show_details_panel = true;

    }
  }
  
};
</script>
