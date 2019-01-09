<template>
  <b-modal ref="confirmstartup" id="confirmstartup" size="md" hide-footer title="Select platform to schedule on-startup recipe">
    <b-form method="post" @submit.prevent="save_boot">
      <b-row>
        <b-col cols="12">
           <b-form-select :options="platforms" v-model="selected_platform" required />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" class="top-10">
          <b-form-input type="text" v-model="startup_name" required placeholder="Name"></b-form-input>
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
  name: "StartupModal",
  data() {
    return {
      platforms: ["Windows", "Linux", "macOS"],
      startup_name: "",
      selected_platform: ""
    };
  },
  mounted() {
    EventBus.$on("confirmboot", recipe_data => {
      this.$refs.confirmstartup.show();
    });
  },
  methods: {
    save_boot() {
      var all_commands = this.filter_commands(
        this.$store.getters["task/commands"]
      );
      this.$http
        .post("startuptasks", {
          platform: this.selected_platform,
          commands: all_commands,
          name: this.startup_name
        })
        .then(response => this.boot_success(response))
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    boot_success(response) {
      EventBus.$emit("showalert", response);
    },
    filter_commands(commands) {
      var command_list = [];
      commands.forEach(function(command) {
        var details = {
          type: "manual",
          input: command.input,
          name: command.name,
          sleep: command.sleep
        };
        command_list.push(details);
      });
      return command_list;
    }
  },
  components: {}
};
</script>
