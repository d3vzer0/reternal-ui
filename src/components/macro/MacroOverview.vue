<template>

  <b-card-group class="macropanel">
    <b-card header="Macros" class="col-4">
      <b-list-group flush>
        <b-list-group-item v-for="macro in macro_list"
        :key="macro._id['$oid']" 
        :class="{'selectedmacro': (macro._id['$oid'] == selected_macro)}"
        @click="show_macro_details(macro), selected_macro = macro._id['$oid']">{{macro.name}}</b-list-group-item>
      </b-list-group>
    </b-card>
    <b-card header="Input">
      <b-list-group flush v-if="show_input">
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
            <b-col><b-button variant="primary-reversed" class="fullwidth" @click="delete_macro">Remove macro</b-button></b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>


</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "MacroOverview",
  data() {
    return {
      macro_list: [],
      macro_id: "",
      macro_input: "",
      macro_command: "",
      selected_macro: "",
      show_input: false
    };
  },
  created() {
    EventBus.$on("refreshmacros", this.get_macros);
  },
  mounted() {
    this.get_macros();
  },
  methods: {
    get_macros() {
      this.$http
        .get("macros")
        .then(response => this.parse_macros(response))
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    delete_macro() {
      var delete_url = `macro/${this.macro_id}`;
      this.$http
        .delete(delete_url)
        .then(this.get_macros())
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    parse_macros(response) {
      this.show_input = false;
      this.macro_list = response.data;
    },
    show_macro_details(macro) {
      this.macro_id = macro["_id"]["$oid"];
      this.macro_command = macro.command;
      this.macro_input = macro.input;
      this.show_input = true;
    }
  }
};
</script>

<style lang="scss" scoped>

.selectedmacro {
  background-color: #9d3a3a;
  color: white;
}

.macropanel {
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

