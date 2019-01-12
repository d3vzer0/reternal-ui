<template>
  <b-modal ref="confirmsave" id="confirmsave" size="md" hide-footer title="Choose name to save recipe">
    <b-form method="post" @submit.prevent="save_recipe">
      <b-row>
        <b-col cols="12" class="top-10">
          <b-form-input type="text" v-model="recipe_name" required placeholder="Name"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="top-10">
        <b-col cols="12">
          <b-button type="submit" variant="primary">Confirm</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "SaveRecipe",
  data() {
    return {
      recipe_name: ""
    };
  },
  mounted() {
    EventBus.$on("confirmsave", recipe_data => {
      this.$refs.confirmsave.show();
    });
  },
  methods: {
    save_recipe() {
      var all_commands = this.filter_commands(
        this.$store.getters["task/commands"]
      );
      this.$http
        .post("recipes", {
          commands: all_commands,
          name: this.recipe_name
        })
        .then(this.$refs.confirmsave.hide())
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    filter_commands(commands) {
      var command_list = [];
      commands.forEach(function(command) {
        var details = {
          type: command.type,
          reference: command.reference_id,
          input: command.input,
          name: command.name,
          sleep: command.sleep
        };
        command_list.push(details);
      });
      return command_list;
    }
  },
};
</script>
