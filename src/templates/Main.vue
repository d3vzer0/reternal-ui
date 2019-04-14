<template>
  <b-container fluid>
    <b-alert :show="dismiss_countDown" variant="primary" @dismissed="dismiss_countDown=0" @dismiss-count-down="countDownChanged"> 
      {{this.alert_message}}      
    </b-alert>
    <startup-modal></startup-modal>
    <recipe-modal></recipe-modal>
    <recipe-save></recipe-save>
    <tasks-modal></tasks-modal>
    <user-change-modal></user-change-modal>
    <user-otp-modal></user-otp-modal>
    <b-row id="row-main">
      <b-col xl="2" lg="2" md="2" sm="2" cols="1" id="col-sidebar">
        <div id="sidebar-header">
          <img src="@/assets/reternal.png" id="sidebar-header-image">
        </div>
        <div id="sidebar-content">
          <hr>
          <b-nav vertical id="sidebar-nav" class="sidebar-nav-links">
            <ul class="nav flex-column">
              <b-nav-item class="nav-item">
                <b-link to="/home" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="desktop" /></span>
                  <span class="nav-item-title">Agents</span>
                </b-link>
              </b-nav-item>

               <b-nav-item class="nav-item">
                <b-link to="/recipe" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="tasks" /></span>
                  <span class="nav-item-title">Recipe <b-badge class="recipecount" variant="primary">{{recipe_count}}</b-badge></span>
                </b-link>
              </b-nav-item>

            </ul>
          </b-nav>
          <hr>

          <!-- <div class="nav-category">
            ATT&CK&trade;
          </div> -->
          <b-nav vertical id="sidebar-nav" class="sidebar-nav-links">
            <ul class="nav flex-column">
              <b-nav-item class="nav-item">
                <b-link to="/actors" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="users" /></span>
                  <span class="nav-item-title">Actors</span>
                </b-link>
              </b-nav-item>
              <b-nav-item class="nav-item">
                <b-link to="/mapping" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="link" /></span>
                  <span class="nav-item-title">Techniques</span>
                </b-link>
              </b-nav-item>
              <b-nav-item class="nav-item">
                <b-link to="/mitre" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="archive" /></span>
                  <span class="nav-item-title">ATT&CK&trade;</span>
                </b-link>
              </b-nav-item>
            </ul>
          </b-nav>
         <hr>
          <!-- <div class="nav-category">
            MANAGEMENT
          </div> -->
          <!-- <hr> -->
          <b-nav vertical id="sidebar-nav" class="sidebar-nav-links">
            <ul class="nav flex-column">
              <b-nav-item class="nav-item">
                <b-link to="/payloads" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="download" /></span>
                  <span class="nav-item-title">payloads</span>
                </b-link>
              </b-nav-item>
              <b-nav-item class="nav-item">
                <b-link to="/macros" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="bookmark" /></span>
                  <span class="nav-item-title">shortcuts</span>
                </b-link>
              </b-nav-item>

              <b-nav-item class="nav-item">
                <b-link to="/startup" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="calendar" /></span>
                  <span class="nav-item-title">startup tasks</span>
                </b-link>
              </b-nav-item>
              <b-nav-item class="nav-item">
                <b-link to="/recipes" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="tasks" /></span>
                  <span class="nav-item-title">Saved Recipes</span>
                </b-link>
              </b-nav-item>
              <b-nav-item class="nav-item">
                <b-link to="/users" active-class="active">
                  <span class="nav-item-icon"><font-awesome-icon icon="user" /></span>
                  <span class="nav-item-title">Users</span>
                  </b-link>
              </b-nav-item>
            </ul>
          </b-nav>
        </div>
      </b-col>

      <b-col id="col-main"> 
        <b-row id="row-navbar">
          <b-col cols="12">
           <b-navbar toggleable="md" type="light" variant="platinum" >
            <b-navbar-nav>
              <b-nav-item to="/navigator"> <font-awesome-icon icon="map-marked" /></b-nav-item>
              <b-nav-item to="/terminal"> <font-awesome-icon icon="terminal" /></b-nav-item>
              <b-nav-item @click="run_recipe"> <font-awesome-icon icon="play-circle" /> </b-nav-item>
              <b-nav-item @click="boot_recipe"> <font-awesome-icon icon="arrow-alt-circle-down" /></b-nav-item>
              <b-nav-item @click="save_recipe"> <font-awesome-icon icon="save" /></b-nav-item>

              <b-nav-item-dropdown right>
                <template slot="button-content">
                 <font-awesome-icon icon="desktop" />
                </template>

                <div v-for="(platform, key, index) in selected_agents">
                  <b-dropdown-item v-for="agent in platform" href="#" @click="change_active_agent(agent)">{{agent.hostname}}</b-dropdown-item>
                  <b-dropdown-divider v-if="platform.agent"></b-dropdown-divider>
                </div>
              </b-nav-item-dropdown>
            </b-navbar-nav>


            <b-navbar-nav class="ml-auto">
              <b-nav-form>
                <b-form-input v-model="c2_dest" id="c2-destination" placeholder="Enter C2 Destination"></b-form-input>
              </b-nav-form>
              <b-nav-item-dropdown right>
                <template slot="button-content">
                <font-awesome-icon icon="cog" />
                </template>
                <b-dropdown-item href="#">Profile</b-dropdown-item>
                <b-dropdown-item @click="logout" href="#">Signout</b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </b-navbar>
        </b-col>
      </b-row>

        <b-row id="row-content">
          <b-col cols="12" class="column-content">
            <transition>
              <router-view></router-view>
            </transition>
          </b-col>
        </b-row>

      </b-col>
    </b-row>
  </b-container>
</template>


<script>
import StartupModal from "@/components/startup/StartupModal";
import RecipeModal from "@/components/recipe/RecipeModal";
import RecipeSave from "@/components/recipe/RecipeSave";
import TasksModal from "@/components/tasks/TasksModal";
import UserOtpModal from "@/components/user/UserOtpModal";
import UserChangeModal from "@/components/user/UserChangeModal";

import EventBus from "@/eventbus";

export default {
  name: "Main",
  data() {
    return {
      selected_agents: this.$store.getters["selection/get_agents_detailed"],
      alert_message: "",
      alert_type: "primary",
      dismiss_secs: 10,
      dismiss_countDown: 0
    };
  },
  created (){
    this.$socket.open();
    this.$options.sockets.connect = () => {
      console.log("Authenticating socket")
      this.$socket.emit("authenticate", {"access_token": this.$store.getters['auth/access_token']})
    }
    this.$options.sockets.disconnect = () => {
      console.log("Disconnected socket")
    },
    this.$options.sockets.emit_result = (result) => {
      this.output_result(result);
    },
    this.$options.sockets.emit_buildstate = (result) => {
      result.data.state = 'SUCCESS'
      this.$store.commit('payloads/change_state', result.data)
    }
  },
  mounted() {
    EventBus.$on("showalert", alert_data => {
      var alert_variant = {
        400: "primary",
        200: "success"
      };
      this.alert_type = alert_variant[alert_data.status];
      this.alert_message = alert_data.data;
      this.show_alert();
    });
  },
  computed: {
    recipe_count: function(){
      var list_length = this.$store.getters["task/commands"].length;
      return list_length;
    },
    c2_dest: {
      get: function() {
        return this.$store.getters['agents/get_dest']
      },
      set: function(destination) {
        this.$store.commit('agents/set_dest', destination)
      }
    }
  },
  methods: {
    logout() {
      this.$store.commit('delete_refresh_token')
      this.$store.commit('delete_access_token')
      this.$router.replace(this.$route.query.redirect || "/login");
    },
    run_recipe() {
      EventBus.$emit("confirmtask");
    },
    boot_recipe() {
      EventBus.$emit("confirmboot");
    },
    save_recipe() {
      EventBus.$emit("confirmsave");
    },
    change_pass() {
      EventBus.$emit("changepass");
    },
    countDownChanged(dismiss_countDown) {
      this.dismiss_countDown = dismiss_countDown;
    },
    change_active_agent(agent) {
      EventBus.$emit("selectagent", agent);
    },
    show_alert() {
      this.dismiss_countDown = this.dismiss_secs;
    },
    output_result(result) {
      this.$store.commit('terminal/add_output', `Task ID: ${result.data.task_id}`);
      this.$store.commit('terminal/add_output', `Magic: ${result.data.magic}`);
      if ('data' in result.data){
        this.$store.commit('terminal/add_output', result.data.data);
      }
      this.$store.commit('terminal/add_output', '-');
    }
  },
  components: {
    StartupModal,
    RecipeModal,
    RecipeSave,
    TasksModal,
    UserChangeModal,
    UserOtpModal
  }
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Open+Sans');
@import "@/assets/style.scss";

body {
  background: linear-gradient(180deg, #343a40 350px, #f4f2f2 350px);
}

#app {
  font-family: 'Muli', "Helvetica", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#row-main {
  min-height: 100vh;
}

#col-sidebar {
  background-color: white;
  border-right-style: solid;
  border-right-width: 1px;
  border-right-color: #bbbbbb;
  max-width:230px;

  .recipecount {
    float: right;
    font-size: inherit;
  }

  #sidebar-header-image {
    width: 100%;
  }

  #sidebar-content {
    color: #8e8e8e;
    text-transform: uppercase;
    .nav-category {
      margin-left: 20px;
      font-size: 16px;
      font-weight: 200;
      letter-spacing: 2px;
      margin-top: 20px;
      margin-bottom: 10px
   }

    .active {
      .nav-item-icon {
        color: #9e1d1d;
      }
    }
    .nav-item-title {
      margin-left: 10px;
    }
    a {
      color: #8e8e8e;
      font-size: 16px;
      font-weight: 400;
      text-decoration: none;

      letter-spacing: 1px;
      &:hover {
        .nav-item-icon {
          color: #9e1d1d;
        }
      }
    }
  }
}

#row-content {
  min-height: 100vh;
  .column-content {
    margin-top: 50px;
    padding-left: 50px;
    padding-right: 50px;
  }
}

#row-navbar {
  border-bottom: 1px;
  color: #e8e5e1;
  .navbar-nav {
    #c2-destination {
      background: transparent;
      border: none;
      width: 400px;
      color: #ddddddab;
      font-family: monospace;
      font-size:18px;
    }
    .nav-item {
      margin-left: 24px;
      margin-right: 20px;
      text-transform: uppercase;
      font-size: 20px;
      font-weight: 400;
      letter-spacing: 2px;
      .dropdown-item {
        font-size: 14px;
      }
    }
    .nav-link {
      color: #dddddd !important;
    }
  }
}


.col-main {
  width: 100%;
}


#techniquemodal {
  font-size: 14px;
}

pre { 
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}

</style>
