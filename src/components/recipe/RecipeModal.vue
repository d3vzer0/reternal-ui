<template>
  <b-modal ref="confirmtask" id="confirmtask" size="md" hide-footer title="Execution date and name">
    <RecipeDatetime></RecipeDatetime>
    <b-form method="post" @submit.prevent="submit_tasks">
      <b-row>
        <b-col cols="12" class="top-10">
          <b-form-input type="text" v-model="task_name" required placeholder="Task name"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="top-10">
        <b-col cols="12">
          <b-button type="submit" variant="primary">Schedule task</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import EventBus from "@/eventbus";
import RecipeDatetime from "@/components/recipe/RecipeDatetime";

export default {
  name: "RecipeModal",
  data() {
    return {
      task_name: ""
    };
  },
  mounted() {
    EventBus.$on("confirmtask", task_data => {
      this.$refs.confirmtask.show();
    });
  },
  methods: {
    submit_tasks() {
      var selected_date = this.$store.getters["task/date"];
      var selected_commands = this.filter_commands(
        this.$store.getters["task/commands"]
      );
      var selected_agents = this.$store.getters["selection/get_agents"];
      for (var agent_id of selected_agents) {
        this.$http
          .post("tasks", {
            beacon_id: agent_id,
            commands: selected_commands,
            name: this.task_name
          })
          .then(response => this.submit_task_response(response));
      }
    },
    submit_task_response(response) {
      this.$refs.confirmtask.hide();
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

  components: {
    RecipeDatetime
  }
};
</script>
