<template>
  <div class="mapping-filters">
    <div class="card mapping-card">
      <div class="card-header mapping-card-header">
          <font-awesome-icon icon="desktop" />
      </div>
      <div class="card-body mapping-card-body">
        <b-list-group>
            <b-list-group-item v-for="platform in platform_options" href="#" v-on:click="get_phases(platform.value), search_platform = platform.value" :active="platform.value === search_platform">{{platform.text}}</b-list-group-item>
        </b-list-group>
      </div>
    </div>
    <div class="card mapping-card">
      <div class="card-header mapping-card-header bg-dark text-white">
          123
      </div>
      <div class="card-body mapping-card-body">
        <b-list-group>
            <b-list-group-item v-for="phase in phase_options" v-on:click="search_phase = phase, get_techniques(phase)" :active="search_phase === phase" href="#">{{phase}}</b-list-group-item>
        </b-list-group>
      </div>
    </div>
  </div>
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
      phase_options: [],
      technique_options: [],
      mapping_options: [],
      search_technique: "",
      search_phase: "",
      search_platform: "Windows"
    };
  },
  created (){
    this.get_phases(this.search_platform)
  },
  computed: {
    search_filters: function() {
      var filters = {
        technique: this.search_technique,
        platform: this.search_platform,
        phase: this.search_phase,
      };
      return filters;
    }
  },
  methods: {
    get_phases(platform){
       this.$http
        .get("techniques", {
          params: {
            platform: platform,
            distinct: "kill_chain_phase"
          }
        })
        .then(response => this.phase_options = response.data)
    },
    get_techniques(phase) {
        EventBus.$emit('get_mapping_flow', this.search_filters)
    }
  }
};
</script>

<style lang="scss" scoped>
#platform-filter {
  max-width: 250px;
}

.mapping-card {
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
  .mapping-card-body {
    padding: 0;
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
