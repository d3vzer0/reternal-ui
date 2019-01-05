<template>
  <b-card header="filter mitre" header-tag="header">
    <p class="card-text">Filter tiles to only display specific agents based on hostname, username or platform</p>
    <b-form method="get" @submit.prevent="filter_mite">
      <b-row>
        <b-col xl="3" lg="4" md="4" sm="6">
          <b-form-radio-group id="platform-select" v-model="search_platform" buttons :options="platform_options" button-variant="primary-reversed">
          </b-form-radio-group>
        </b-col>
        <b-col xl="9" lg="8" md="8" sm="6">
          <b-form-input type="text" v-model="search_generic" placeholder="Username or Hostname"></b-form-input>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>


<script>
import _ from 'lodash'; 

export default {
  name: "AgentFilter",
  data(){
    return {
      agent_list: [],
      search_platform: "",
      search_generic: "",
      platform_options: [
        { text: "Any", value: "" },
        { text: "Windows", value: "Windows" },
        { text: "Mac", value: "macOS" },
        { text: "Linux", value: 'Linux' },
      ],
      error: "",
    }
  },
  mounted () {
    this.get_agents_filtered()
  },
  methods: {
    get_agents_filtered: _.debounce(function (){
        this.$http
          .get('agents', {params:{platform:this.agent_search_platform,
                search:this.agent_search_generic}})
          .then(response => this.parse_agents(response))
          .catch(response => this.generic_failed(response))
      }, 200),
    parse_agents (response){
      this.$parent.agent_list = response.data;
    },
    generic_failed (response){
      this.error = "Unable to perform request";
    }
  },
  watch: {
    search_platform: function(value){
      this.search_platform = value;
      this.get_agents_filtered()
    },
    search_generic: function(value){
      this.search_generic = value;
      this.get_agents_filtered()
    }
  }
};
</script>

<style lang="sass">
.agent-card
  width: 100%

  &.active
    border-color: #9e1d1d
    border-width: 2px

.agent-tiles
  .btn
    width: 100%

</style>

