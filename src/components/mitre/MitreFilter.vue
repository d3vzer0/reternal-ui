<template>
  <b-row class="justify-content-center">
    <b-col cols="2">
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           <font-awesome-icon icon="desktop" />
        </div>
        <div class="card-body mapping-card-body">
          <b-form-select v-model="search_platform" :options="platform_options" class="platform-select"></b-form-select>
        </div>
      </div>
    </b-col>
    <b-col cols="3">
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           123
        </div>
        <div class="card-body mapping-card-body">
          <b-form-select v-model="search_phase" :options="technique_options" class="platform-select"></b-form-select>
        </div>
      </div>
    </b-col>
    <b-col cols="">
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           <font-awesome-icon icon="search" />
        </div>
        <div class="card-body mapping-card-body">
          <b-form-input type="text" v-model.lazy="search_technique" placeholder="Technique name"></b-form-input>
        </div>
      </div>
    </b-col>
  </b-row>

</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "MitreFilter",
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
      EventBus.$emit("refreshmitre", this.search_filters);
    },
    search_platform: function(value) {
      this.search_platform = value;
      EventBus.$emit("refreshmitre", this.search_filters);
    },
    search_technique: function(value) {
      this.search_technique = value;
      EventBus.$emit("refreshmitre", this.search_filters);
    }
  }
};
</script>

<style lang="scss" scoped>
#platform-select {
  max-width: 250px;
}

.mapping-card {
  .mapping-card-body {
    padding: 0;
    input {
      border-radius: 0px;
    }
    .platform-select {
      border-radius: 0px;
    }
  }
  .mapping-card-header{
    border-radius: 0px;
    border: 2px;
    border-width: 3px;
    text-align: center;
    background-color: #f4f2f2;
    color: #4c5c68;
    font-size: 60px;
  }
}
</style>
