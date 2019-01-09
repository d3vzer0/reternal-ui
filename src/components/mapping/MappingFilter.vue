<template>

  <b-card header="filter mitre" header-tag="header">
  <p class="card-text">Filter the MITRE table to find mapped techniques</p>
    <b-form method="get" @submit.prevent="filter_mite">
      <b-row>
          <b-col xl="3" lg="3" md="4" sm="6">
          <b-form-radio-group id="platform-select" v-model="search_platform"  buttons :options="platform_options" button-variant="primary-reversed">
          </b-form-radio-group>
          </b-col>
          <b-col xl="4" lg="5" md="4" sm="2">
          <b-form-select :options="technique_options" v-model="search_phase" required />
          </b-col>
          <b-col xl="5" lg="4" md="4" sm="4">
          <b-form-input type="text" v-model.lazy="search_technique" placeholder="Technique name"></b-form-input>
          </b-col>
      </b-row>
    </b-form>
  </b-card>

</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "MappingFilter",
  data() {
    return {
      platform_options: [
        { text: "Windows", value: "Windows" },
        { text: "Mac", value: "macOS" },
        { text: "Linux", value: "Linux" }
      ],
      technique_options: [
        { text: "Any", value: "" },
        { text: "initial-access", value: "initial-access" },
        { text: "execution", value: "execution" },
        { text: "persistences", value: "persistence" },
        { text: "privilege-escalation", value: "privilege-escalation" },
        { text: "defense-evasion", value: "defense-evasion" },
        { text: "credential-access", value: "credential-access" },
        { text: "discovery", value: "discovery" },
        { text: "lateral-movement", value: "lateral-movement" },
        { text: "exfiltration", value: "exfiltration" },
        { text: "collection", value: "collection" },
        { text: "command-and-control", value: "command-and-control" }
      ],
      search_technique: "",
      search_phase: "",
      search_platform: "Windows"
    };
  },
  computed: {
    search_filters: function() {
      var filters = {
        technique: this.search_technique,
        platform: this.search_platform,
        phase: this.search_phase
      };
      return filters;
    }
  },
  watch: {
    search_phase: function(value) {
      this.search_phase = value;
      EventBus.$emit("refreshmapping", this.search_filters);
    },
    search_platform: function(value) {
      this.search_platform = value;
      EventBus.$emit("refreshmapping", this.search_filters);
    },
    search_technique: function(value) {
      this.search_technique = value;
      EventBus.$emit("refreshmapping", this.search_filters);
    }
  }
};
</script>
