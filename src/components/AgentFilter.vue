<template>
  <b-card header="filter mitre" header-tag="header">
    <p class="card-text">Filter tiles to only display specific agents based on hostname, username or platform</p>
    <b-form method="get" @submit.prevent="filter_mite">
      <b-row>
        <b-col xl="3" lg="4" md="4" sm="6">
          <b-form-radio-group id="platform-select" v-model="agent_search_platform" @change="get_agents_filtered" buttons :options="platform_options" button-variant="primary-reversed">
          </b-form-radio-group>
        </b-col>
        <b-col xl="9" lg="8" md="8" sm="6">
          <b-form-input type="text" v-model.lazy="agent_search_generic" @keyup.native="get_agents_filtered" placeholder="Username or Hostname"></b-form-input>
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
      agent_list: [
      ],
      agent_search_platform: "Windows",
      agent_search_generic: "",
      platform_options: [
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
      console.log(1);
        this.$http
          .get('agents', {params:{platform:this.agent_search_platform,
                search:this.agent_search_generic}})
          .then(response => this.parse_agents(response))
          .catch(response => this.generic_failed(response))
      }, 200),
    parse_agents (response){
      this.$parent.agent_list = response.data;
      console.log(this.$parent.agent_list)
    },
    generic_failed (response){
      this.error = "Unable to perform request";
    }
  }
};
</script>

<style lang="sass">
.agent-card
  width: 100%
  // &.card
  //   width: 300px
  &.active
    border-color: #9e1d1d
    border-width: 2px

.agent-tiles
  .btn
    width: 100%

</style>

