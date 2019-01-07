<template>
  <b-container fluid>
    <b-alert :show="dismiss_countDown" variant="primary" @dismissed="dismiss_countDown=0" @dismiss-count-down="countDownChanged"> 
      {{this.alert_message}}      
    </b-alert>

    <StartupModal></StartupModal>
    <b-row id="row-main">
      <b-col xl="2" lg="2" md="2" sm="2" cols="1" id="col-sidebar">
        <div id="sidebar-header">
          <img src="@/assets/reternal.png" id="sidebar-header-image">
        </div>
        <div id="sidebar-content">
          <hr>
          <b-nav vertical id="sidebar-nav" class="sidebar-nav-links">
            <ul class="nav flex-column">
              <b-nav-item class="nav-item" to="/home">
                <span class="nav-item-icon"><font-awesome-icon icon="home" /></span>
                <span class="nav-item-title">Dashboard</span>
              </b-nav-item>
              <b-nav-item class="nav-item" to="/agents">
                <span class="nav-item-icon"><font-awesome-icon icon="desktop" /></span>
                <span class="nav-item-title">Agents</span>
              </b-nav-item>
               <b-nav-item class="nav-item" to="/recipe">
                <span class="nav-item-icon"><font-awesome-icon icon="tasks" /></span>
                <span class="nav-item-title">Recipe Builder</span>
              </b-nav-item>

            </ul>
          </b-nav>
          <div class="nav-category">
            MITRE
          </div>
          <b-nav vertical id="sidebar-nav" class="sidebar-nav-links">
            <ul class="nav flex-column">
              <b-nav-item class="nav-item" to="/mapping">
                <span class="nav-item-icon"><font-awesome-icon icon="link" /></span>
                <span class="nav-item-title">Linked techniques</span>
              </b-nav-item>
              <b-nav-item class="nav-item" to="/mitre">
                <span class="nav-item-icon"><font-awesome-icon icon="archive" /></span>
                <span class="nav-item-title">Mitre Archive</span>
              </b-nav-item>
            </ul>
          </b-nav>
          <div class="nav-category">
            BEACON CONTROL
          </div>
          <b-nav vertical id="sidebar-nav" class="sidebar-nav-links">
            <ul class="nav flex-column">
              <b-nav-item class="nav-item" to="/payloads">
                <span class="nav-item-icon"><font-awesome-icon icon="download" /></span>
                <span class="nav-item-title">payloads</span>
              </b-nav-item>
              <b-nav-item class="nav-item" to="/macros">
                <span class="nav-item-icon"><font-awesome-icon icon="bookmark" /></span>
                <span class="nav-item-title">macros</span>
              </b-nav-item>
              <b-nav-item class="nav-item" to="/startup">
                <span class="nav-item-icon"><font-awesome-icon icon="calendar" /></span>
                <span class="nav-item-title">startup tasks</span>
              </b-nav-item>
            </ul>
          </b-nav>
          <div class="nav-category">
            MANAGEMENT
          </div>
          <b-nav vertical id="sidebar-nav" class="sidebar-nav-links">
            <ul class="nav flex-column">
              <b-nav-item class="nav-item" to="profile">
                <span class="nav-item-icon"><font-awesome-icon icon="user" /></span>
                <span class="nav-item-title">Profile</span>
              </b-nav-item>
            </ul>
          </b-nav>
        </div>
      </b-col>

      <b-col id="col-main" xl="10" lg="10" md="10" sm="10" cols="11">
        <b-row id="row-navbar">
          <b-col cols="12">
          <b-navbar toggleable="md" type="light" variant="platinum" >
            <b-navbar-nav>
              <b-nav-item to="terminal"> <font-awesome-icon icon="terminal" /> Terminal</b-nav-item>
              <b-nav-item v-on:click="run_recipe"> <font-awesome-icon icon="play-circle" /> Run Recipe</b-nav-item>
              <b-nav-item v-on:click="boot_recipe"> <font-awesome-icon icon="arrow-alt-circle-down" /> Startup Recipe</b-nav-item>

              <b-nav-item-dropdown right>
                <template slot="button-content">
                 <font-awesome-icon icon="desktop" />  Agents
                </template>

                <div v-for="(platform, key, index) in selected_agents">
                  <b-dropdown-item v-for="agent in platform" href="#" v-on:click="change_active_agent(agent)">{{agent.hostname}}</b-dropdown-item>
                  <b-dropdown-divider v-if="platform.agent"></b-dropdown-divider>
                </div>
              </b-nav-item-dropdown>

            </b-navbar-nav>

            

            <b-navbar-nav class="ml-auto">
              <b-nav-item-dropdown right>
                <template slot="button-content">
                <font-awesome-icon icon="cog" />  Settings
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item v-on:click="logout" href="#">Signout</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>

          </b-navbar>

          </b-col>
        </b-row>

        <b-row id="row-content">
          <b-col cols="12">
            <transition>
              <router-view></router-view>
            </transition>
          </b-col>
        </b-row>

        <b-row id="row-footer">
          <b-col cols="12">
            <b-row>
              <b-col class="text-right">Created by: Joey Dreijer</b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import StartupModal from "@/components/startup/StartupModal";
import EventBus from "@/eventbus";

export default {
  name: 'Main',
  data (){
    return {
      selected_agents: this.$store.getters['selection/get_agents_detailed'],
      alert_message: "",
      alert_type: "primary",
      dismiss_secs: 10,
      dismiss_countDown: 0,
    }
  },
  mounted (){
    EventBus.$on('showalert', alert_data =>{
      var alert_variant = {
        400:"primary",
        200: "success"
      }
      this.alert_type = alert_variant[alert_data.status];
      this.alert_message = alert_data.data;
      this.show_alert();
    });
  },
  methods: {
    logout (){
      localStorage.removeItem("token");
      this.$router.replace(this.$route.query.redirect || '/login')
    },
    run_recipe(){
      var selected_date = this.$store.getters['task/date'];
      var selected_commands = this.filter_commands(this.$store.getters['task/commands']);
      var selected_techniques = this.$store.getters['task/techniques'];
      var selected_agents = this.$store.getters['selection/get_agents'];
      for (var agent_id of selected_agents){
        this.$http
          .post('tasks', {beacon_id: agent_id, commands: selected_commands})
          .then(response => this.schedule_success(response))
          .catch(response => this.generic_failed(response))
      }
    },
    boot_recipe(){
      var recipe_data = {
        date: this.$store.getters['task/date'],
        commands: this.filter_commands(this.$store.getters['task/commands']),
        techniques: this.$store.getters['selection/get_agents']
      }
      EventBus.$emit('confirmboot', recipe_data);
    },
    filter_commands(commands){
      var command_list = [];
      commands.forEach(function(command){
        var details = {type: "manual", input:command.input, name :command.name, sleep: command.sleep}
        command_list.push(details)
      })
      return command_list;
    },
    populate_beacons_selection (){

    },
    countDownChanged (dismiss_countDown) {
      this.dismiss_countDown = dismiss_countDown
    },
    change_active_agent (agent){
      EventBus.$emit('selectagent', agent);
    },
    show_alert () {
      this.dismiss_countDown = this.dismiss_secs
    }
  },
  components: {
    StartupModal
  }
}
</script>

<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Open+Sans')
@import "@/assets/style.sass"

#app
  font-family: 'Muli', "Helvetica", Arial, sans-serif;
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale


#row-main
  min-height: 100vh

#col-sidebar
  background-color: white
  border-right-style: solid
  border-right-width: 1px
  border-right-color: #bbbbbb

  #sidebar-header-image
    width: 100%

  #sidebar-content
    color: #8e8e8e
    text-transform: uppercase
    .nav-category
      margin-left: 20px
      font-size: 16px
      font-weight: 200
      letter-spacing: 2px
      margin-top: 20px
      margin-bottom: 10px

    .active
      color: #9e1d1d
    .nav-item-title
      margin-left: 10px
    a
      color: #8e8e8e
      font-size: 16px
      font-weight: 400
      letter-spacing: 1px
      &:hover
        .nav-item-icon
          color: #9e1d1d
 

#row-content
  background-color: #f4f2f2
  min-height: 100vh

#row-navbar
  border-bottom: 1px
  border-bottom-color: #bbbbbb
  border-bottom-style: solid
  background-color: #eeeeee
  color: #e8e5e1

.navbar-nav
  .nav-item
    text-transform: uppercase
    font-size: 12px
    font-weight: 400
    letter-spacing: 2px

.col-main
  width: 100%

.footer
  height: 50px

#techniquemodal
  font-size: 14px

pre 
  font-family: inherit
  font-size: inherit
  font-weight: inherit
  -webkit-font-smoothing: antialiased
  -moz-osx-font-smoothing: grayscale
  white-space: pre-wrap
  white-space: -moz-pre-wrap
  white-space: -pre-wrap
  white-space: -o-pre-wrap
  word-wrap: break-word

// .fade-enter-active, .fade-leave-active 
//   transition: opacity .5s

// .fade-enter, .fade-leave-to 
//   opacity: 0;


</style>
