
<template>
  <b-card header="filter startup" header-tag="header">
    <p class="card-text">Filter the startup tasks for specific platforms, commands etc</p>
    <b-form method="get" @submit.prevent="filter_startup">
      <b-row>
        <b-col xl="3" lg="3" md="4" sm="6">
          <b-form-radio-group id="platform-select" v-model="search_platform" buttons :options="platform_options" button-variant="primary-reversed">
          </b-form-radio-group>
        </b-col>
        <b-col>
          <b-form-input type="text" v-model="search_input" placeholder="Command input"></b-form-input>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "StartupFilter",
  data() {
    return {
      platform_options: [
        { text: "Windows", value: "Windows" },
        { text: "Mac", value: "macOS" },
        { text: "Linux", value: "Linux" }
      ],
      search_platform: "Windows",
      search_input: ""
    };
  },
  methods: {
    get_startup_filtered() {
      var filter_options = {
        platform: this.search_platform,
        input: this.startup_search_input
      };
      EventBus.$emit("getstartup", filter_options);
    }
  },
  watch: {
    search_platform: function(value) {
      this.search_platform = value;
      this.get_startup_filtered();
    },
    search_input: function(value) {
      this.search_input = value;
      this.get_startup_filtered();
    }
  }
};
</script>

<style lang="sass">

</style>
