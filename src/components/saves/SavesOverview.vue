<template>
  <div id="recipe-overview">
    <b-row v-if="campaign">
      <b-col cols="8">
        <div class="card">
          <div class="card-header bg-dark-child text-dark">
            <span slot="header">
              {{campaign}}
              <span class="float-right add-save">
                <b-badge href="#" pill variant="dark" v-on:click="delete_campaign(campaign)"><font-awesome-icon icon="minus"/></b-badge>
              </span>
              <span class="float-right delete-save">
                <b-badge href="#" pill variant="dark"><font-awesome-icon icon="plus" /></b-badge> 
              </span>
            </span>
          </div>
        </div>
      </b-col>
    </b-row>
    <div v-for="command in task_commands" :key="command.rand">
      <b-row>
        <b-col cols="8">
          <b-card class="recipe-card" header-bg-variant="dark" header-text-variant="white" header-tag="header">
            <b-card-text>
              <b-list-group flush>
                <b-list-group-item>
                  <b-row>
                    <b-col><b>Type</b></b-col>
                    <b-col>{{command.type}}</b-col>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item v-if="command.type == 'Mitre'">
                  <b-row>
                    <b-col><b>Command</b></b-col>
                    <b-col>{{command.reference_name}}</b-col>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item v-if="command.type == 'Mitre'">
                  <b-row>
                    <b-col><b>Technique</b></b-col>
                    <b-col>{{command.technique_name}}</b-col>
                  </b-row>
                </b-list-group-item>
                <b-list-group-item v-if="command.type == 'Mitre'">
                  <b-row>
                    <b-col><b>Phase</b></b-col>
                    <b-col>{{command.kill_chain_phase}}</b-col>
                  </b-row>
                </b-list-group-item>

                <b-list-group-item>
                  <b-row>
                    <b-col><b>Input</b></b-col>
                  </b-row>
                  <b-row>
                    <b-col>{{command.input}}</b-col>
                  </b-row>
                </b-list-group-item>
              </b-list-group>
            </b-card-text>
          </b-card>
        </b-col>
      </b-row>
      <b-row class="timeout-seperator">
        <b-col cols="8" class="text-center">
          <font-awesome-icon icon="clock" /> {{command.sleep}}
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "RecipesOverview",
  data() {
    return {
      task_commands: [],
      campaign: ''
    };
  },
  beforeDestroy(){
    EventBus.$off('get_campaign')
  },
  mounted() {
    EventBus.$on("get_campaign", campaign => {
      this.task_commands = []
      this.campaign = campaign
      this.get_campaign(campaign);
    })
  },
  methods: {
    recipes_success(response) {
      this.recipe_list = response.data;
    },
    get_campaign(recipe) {
      var campaign_url = `recipe/${recipe}`;
        this.$http
          .get(campaign_url)
          .then(response => this.display_mapping_flow(response.data))
    },
    delete_campaign(campaign){
      var campaign_url = `recipe/${campaign}`
      this.$http
        .delete(campaign_url)
        .then(response => this.reset_state())
    },
    reset_state() {
      this.task_commands = []
      this.campaign = null
      EventBus.$emit('refresh_campaigns')
    },
    display_mapping_flow(result) {
      result.forEach(mapping => {
        if ('metadata' in mapping) {
          this.task_commands.push({
            type: mapping.commands.type,
            reference_name: mapping.commands.name,
            technique_name: mapping.metadata.technique_name,
            kill_chain_phase: mapping.metadata.kill_chain_phase,
            input: mapping.commands.input,
            sleep: mapping.commands.sleep
          })
        }
        else {
          this.task_commands.push({
            type: mapping.commands.type,
            reference_name: mapping.commands.name,
            input: mapping.commands.input,
            sleep: mapping.commands.sleep
          })
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.add-save {
    padding-left:10px;
}
.mapping-techniques {
  .category:nth-child(n+5) {
    .card-header {
      background-color: #343a40 !important;
      color: white !important;
      .badge {
        color: #343a40;
        background-color: white;
      }
    }
  }
  .cmdinput {
    word-break: break-all;
  }
  .seperator-circle {
    height: 20px;
  }
  .card {
    .list-group{
      .list-group-item {
        &.active {
          background-color: #9e1c1d;
        }
      }
    }
    .card-header{
      &.bg-dark-child {
        background-color: #343a40c2 !important;
      }
      .badge {
        font-size: 100%;
      }
    }
  }
}

.recipespanel {
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
  .card {
    padding: 0px;
  }
  .card-body {
    padding: 0px;
  }
  .badge {
    background-color: #9d3a3a;
  }
}

.selectedrecipe {
  background-color: #9d3a3a;
  color: white;
  .badge {
    background-color: white;
    color: #9d3a3a;
  }
}

.selectedcommand {
  background-color: #9d3a3a;
  color: white;
}



</style>
