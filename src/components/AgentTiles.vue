<template>
  <div class="agent-overview">

    <b-row class="top-10">
      <b-col>
        <b-card header="filter mitre" header-tag="header">
          <p class="card-text">Filter tiles to only display specific agents based on hostname, username or platform</p>
          <b-form method="get" @submit.prevent="filter_mite">
            <b-row>
              <b-col xl="2" lg="3" md="4" sm="6">
                <b-form-radio-group id="platform-select" v-model="agent_search_platform" @change="get_agents_filtered" buttons :options="platform_options" button-variant="primary-reversed">
                </b-form-radio-group>
              </b-col>
              <b-col xl="10" lg="9" md="8" sm="6">
                <b-form-input type="text" v-model.lazy="agent_search_generic" @keyup.native="get_agents_filtered" placeholder="Username or Hostname"></b-form-input>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    
    <b-row class="top-10 agent-tiles">
      <b-col cols="12">
        <b-card-group columns>
          <b-card :header="agent.hostname" v-for="agent in agent_list" class="agent-card" v-on:click="click_agent_tile(agent)" :class="{active: is_selected(agent)}">
            <b-row>
              <b-col>State</b-col><b-col>{{agent.state}}</b-col>
            </b-row>
            <b-row>
              <b-col>Username</b-col><b-col>{{agent.username}}</b-col>
            </b-row>
            <b-row>
              <b-col>Platform</b-col><b-col>{{agent.platform}}</b-col>
            </b-row>
            <b-row>
              <b-col>Remote IP</b-col><b-col>{{agent.remote_ip}}</b-col>
            </b-row>
            <b-row>
              <b-col>Last Pulse</b-col><b-col>{{agent.last_beacon}}</b-col>
            </b-row><br/>
            <b-row>
              <b-col cols="6">
                <router-link :to="{ name: 'AgentDetails', params: {agent_id: agent.beacon_id} }"> <b-button size="sm" variant="primary">History</b-button></router-link>
                </b-col>
              <b-col cols="6">
                <router-link :to="{ name: 'AgentTasks', params: {agent_id: agent.beacon_id} }"> <b-button size="sm" variant="primary">Tasks</b-button></router-link>
              </b-col>
            </b-row>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import _ from 'lodash'; 

export default {
  name: "AgentTiles",
  data(){
    return {
      agent_list: [
      ],
      is_active: false,
      selected_agents: this.$store.getters['selection/get_agents'],
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
        this.$http
          .get('agents', {params:{platform:this.agent_search_platform,
                search:this.agent_search_generic}})
          .then(response => this.parse_agents(response))
          .catch(response => this.generic_failed(response))
      }, 500),
    parse_agents (response){
      this.agent_list = response.data;
    },
    generic_failed (response){
      this.error = "Unable to perform request";
    },
    click_agent_tile (agent_object){
      this.$store.commit('selection/add_agent', agent_object);
    },
    is_selected (agent_object){
      if(this.$store.getters['selection/get_agents'].includes(agent_object.beacon_id)){
        return true;
      }
    }
  }
};
</script>

<style lang="sass">

.agent-card
  width: 200px
  &.active
    border-color: #9e1d1d
    border-width: 2px

.agent-tiles
  .btn
    width: 100%

</style>
