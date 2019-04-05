<template>
  <b-row class="justify-content-center">
    <b-col cols="3">
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           <font-awesome-icon icon="desktop" />
        </div>
        <div class="card-body mapping-card-body">
          <b-form-select v-model="search_platform" :options="platform_options" class="platform-select"></b-form-select>
        </div>
      </div>
    </b-col> 
    <b-col>
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
           <font-awesome-icon icon="search" />
        </div>
        <div class="card-body mapping-card-body">
          <b-form-input type="text" v-model.lazy="search_generic" placeholder="Hostname or username"></b-form-input>
        </div>
      </div>
    </b-col>
  </b-row>
</template>


<script>
import _ from "lodash";

export default {
  name: "AgentFilter",
  data() {
    return {
      agent_list: [],
      search_platform: "",
      search_generic: "",
      platform_options: [
        { text: "Any", value: "" },
        { text: "Windows", value: "Windows" },
        { text: "Mac", value: "macOS" },
        { text: "Linux", value: "Linux" }
      ],
      error: ""
    };
  },
  mounted() {
    this.get_agents_filtered();
  },
  methods: {
    get_agents_filtered: _.debounce(function() {
      this.$http
        .get("agents", {
          params: {
            platform: this.search_platform,
            search: this.search_generic
          }
        })
        .then(response => this.parse_agents(response))
        .catch(response => this.generic_failed(response))
    }, 200),
    parse_agents(response) {
      this.$parent.agent_list = response.data
      response.data.forEach(element => {
        this.$store.commit('agents/add_agent', element)
      });
    },
    generic_failed(response) {
      this.error = "Unable to perform request";
    }
  },
  watch: {
    search_platform: function(value) {
      this.search_platform = value;
      this.get_agents_filtered()
    },
    search_generic: function(value) {
      this.search_generic = value;
      this.get_agents_filtered()
    }
  }
};
</script>

<style lang="scss">

#platform-select-column {
  max-width: 300px;
}
#agent-filter-card {
  // border-top-left-radius: 0px;
  // border-top-color:#343a40;
  // border-top-width: 4px;
}
.agent-tiles {
  .btn {
    width: 100%;
  }
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
