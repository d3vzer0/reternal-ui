<template>
  <b-modal ref="showtext" id="showtext" size="lg" hide-footer title="Output of command" >
    <b-form-textarea id="textoutput"
                     v-model="command_output"
                     :rows="3" disabled
                     :max-rows="6">
    </b-form-textarea>
  </b-modal>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "TasksModal",
  data() {
    return {
      command_output: ""
    };
  },
  mounted() {
    EventBus.$on("showtasktext", task_data => {
      this.command_output = task_data;
      this.$refs.showtext.show();
    });
  },
  methods: {
  },

  components: {}
};
</script>
