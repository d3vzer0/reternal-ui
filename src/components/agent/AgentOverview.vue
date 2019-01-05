<template>
  <masonry :cols="3" :gutter="40">
    <b-card class="agent-card" v-for="agent in $parent.agent_list" :header="agent.hostname" v-on:click="click_agent_tile(agent)" :class="{active: is_selected(agent)}">
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
  </masonry>
</template>

<script>
import Vue from "vue";
import VueMasonry from "vue-masonry-css";
Vue.use(VueMasonry);

export default {
  name: "AgentOverview",
  data(){
    return {
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
  methods: {
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
  width: 100%
 
.card
  margin-bottom: 20px
  &.active
    border-color: #9e1d1d
    border-width: 2px
  .btn
    width: 100%

</style>
