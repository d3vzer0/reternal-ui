<template>
  <masonry :cols="3" :gutter="40">
    <b-card class="agent-card" v-for="agent in $parent.agent_list"
      @click="click_agent_tile(agent)" :class="{active: is_selected(agent)}">
      <b-row class="agent-card-container">
        <b-col cols="5" class="agent-card-platform">
          <div class="platform-body">
            <span>
              <font-awesome-icon :icon="['fab', 'windows']" v-if="agent.platform == 'Windows'"/>
              <font-awesome-icon :icon="['fab', 'apple']" v-if="agent.platform == 'macOS'"/>
              <font-awesome-icon :icon="['fab', 'linux']" v-if="agent.platform == 'Linux'"/>
            </span>
          </div>
        </b-col>
        <b-col class="agent-card-content">
          <b-row>
            <b-col cols="1"><font-awesome-icon icon="user" /></b-col><b-col>{{agent.username}}</b-col>
          </b-row>
          <b-row>
             <b-col cols="1"><font-awesome-icon icon="ethernet" /></b-col><b-col>{{agent.remote_ip}}</b-col>
          </b-row>
          <b-row>
             <b-col cols="1"><font-awesome-icon icon="desktop" /></b-col><b-col>{{agent.hostname}}</b-col>
          </b-row>
           <b-row>
             <b-col cols="1"><font-awesome-icon icon="plug" /></b-col>
             <b-col class="agentonline" v-if="state_check(agent.output.timestamp.$date, agent.timer, agent.jitter) === 'online'">Online</b-col>
             <b-col class="agentoffline" v-if="state_check(agent.output.timestamp.$date, agent.timer, agent.jitter) === 'offline'">Offline</b-col>
          </b-row>
           <b-row>
             <b-col cols="1"><font-awesome-icon icon="clock" /></b-col><b-col>{{to_unix(agent.output.timestamp.$date)}}</b-col>
          </b-row>
          <b-row>
            <b-col>{{agent.last_beacon}}</b-col>
          </b-row><br/>
          <b-row>
            <b-col cols="12">
              <b-button-group class="agent-buttons">
                <router-link class="agent-button" :to="{ name: 'AgentDetails', params: {agent_id: agent.beacon_id} }"><b-button variant="primary-reversed">History</b-button></router-link>
                <router-link class="agent-button" :to="{ name: 'AgentTasks', params: {agent_id: agent.beacon_id} }"><b-button variant="primary-reversed">Tasks</b-button></router-link>
              </b-button-group>
            </b-col>
          </b-row>
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
  data() {
    return {
      is_active: false,
      selected_agents: this.$store.getters["selection/get_agents"],
      agent_search_platform: "Windows",
      agent_search_generic: "",
      platform_options: [
        { text: "Windows", value: "Windows" },
        { text: "Mac", value: "macOS" },
        { text: "Linux", value: "Linux" }
      ],
      error: ""
    };
  },
  methods: {
    generic_failed(response) {
      this.error = "Unable to perform request";
    },
    state_check(agent_time, timer, jitter){
      var state_time = (agent_time / 1000) + (jitter * timer)
      var current_time = this.$moment().unix()

      console.log(agent_time, state_time, current_time, timer, jitter)

      if (current_time > state_time) {
        return 'offline'
      }
      else {
        return 'online'
      }
    },
    to_unix(unix_timestamp) {
      var from_miliseconds = unix_timestamp / 1000;
      var datetime = this.$moment
        .unix(from_miliseconds)
        .format("YYYY-MM-DD HH:mm:ss");
      return datetime;
    },
    click_agent_tile(agent_object) {
      this.$store.commit("selection/add_agent", agent_object);
    },
    is_selected(agent_object) {
      if (
        this.$store.getters["selection/get_agents"].includes(
          agent_object.beacon_id
        )
      ) {
        return true;
      }
    }
  }
};
</script>


<style lang="scss" scoped>
.agent-card-container {
  margin: 0px;
}
.agent-card {
  width: 100%;
  .agent-button {
    width: 50%;
  }
  .agentonline {
    color: green;
  }
  .agentoffline {
    color: red;
  }
  &.active {
    outline: 4px solid #00a5d69e;
  }
  .card-body {
    padding: 0px;
  }
  .agent-card-platform {
    background-color: #343a40;
    .platform-body {
      text-align: center;
      margin: auto;
      font-size: 90px;
      color:white;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .agent-card-content {
    padding: 1.25rem;
    font-family: monospace;
    font-size: 14px;
    .agent-buttons {
      width: 100%;
      .btn {
        border-radius: 0px;
        font-size: 12px;
      }
    }
  }
}


</style>