<template>
 <div id="recipe-overview">
   <b-row>
      <b-col offset="2" cols="1" class="command-seperator">
        </b-col>
        <b-col cols="5">
          <b-card class="agent-card" header="Details">
            <b-list-group flush>
              <b-list-group-item>
                <b-row>
                  <b-col><b>ID</b></b-col>
                  <b-col>{{mapping_details.details.external_id}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Platform</b></b-col>
                  <b-col>{{mapping_details.details.platform}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Phase</b></b-col>
                  <b-col>{{mapping_details.details.kill_chain_phase}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Technique</b></b-col>
                  <b-col>{{mapping_details.details.technique_name}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item >
                <b-row>
                  <b-col><b>Description</b></b-col>
                  <b-col>{{mapping_details.details.description}}</b-col>
                </b-row>
              </b-list-group-item>
               <b-list-group-item v-if="mapping_details.commands.length > 0"><b-button @click="add_to_recipe" variant="primary">Add commands to recipe</b-button></b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>

    <div v-for="command in mapping_details.commands">
      <b-row>
        <b-col offset="2" cols="1" class="command-seperator">
          <div class="seperator-line">
          </div>
          <div class="seperator-circle">
            <div class="seperator-time">
              {{ command.sleep }}
            </div>
          </div>
        </b-col>
        <b-col cols="5">
          <b-card class="agent-card" :header="command.name">
            <b-list-group flush>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Input</b></b-col>
                  <b-col>{{command.input}}</b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "MappingOverview",
  data() {
    return {
      mapping_details: {
        commands: [],
        details: {},
      },
      command_input: "",
      command_sleep: 0,
      command_type: "",
      show_input: false,
    };
  },
  created() {
    EventBus.$on("get_mapping_flow", filters => {
      this.get_mapping_flow(filters);
    });
  },
  methods: {
    get_mapping_flow(filters) {
      this.$http
        .get("mapping", {
          params: {
            name: filters.mapping,
            phase: filters.phase,
            platform: filters.platform,
            technique: filters.technique,
          }
        })
        .then(response => this.display_mapping_flow(response.data))
    },
    display_mapping_flow(result) {
      this.mapping_details.details = result[0];
      this.$set(this.mapping_details, 'commands', result[0].commands);
    },
    
    add_to_recipe() {
      this.mapping_details.commands.forEach(command => {
        var random_array = new Uint32Array(5);
        var random_id = window.crypto.getRandomValues(random_array)[2];
        var command_options = {
          reference_name: this.mapping_details.details.name,
          reference_id: this.mapping_details.details._id['$oid'],
          technique_name: this.mapping_details.details.technique_name,
          kill_chain_phase: this.mapping_details.details.kill_chain_phase,
          technique_id: this.mapping_details.details.technique_id,
          name: command.name,
          input: command.input,
          sleep: command.sleep,
          rand: random_id,
          type: command.type
        };
        this.$store.commit("task/add_command", command_options);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.addrecipecol {
  background-color: #9d3a3a;
  text-transform: uppercase;
  a {
    color: white;
    text-decoration: none;
  }
} 

.selectedtechnique {
  background-color: #9d3a3a;
  color: white;
}

.selectedphase {
  background-color: #9d3a3a;
  color: white;
}

.selectedcommand {
  background-color: #9d3a3a;
  color: white;
}

.selectedmapping {
  background-color: #9d3a3a;
  color: white;
}

.mappingpanel {
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



.selectedcommand {
  background-color: #9d3a3a;
  color: white;
}

.command-seperator {
  .seperator-line {
    width: 100%;
    height: 100%;
    border-left: 5px;
    border-left-style: solid;
    border-left-color: #9d3a3a;
    position: relative;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    margin-left: 6px;
  }
  .seperator-circle{
    content: "";
    width: 16px;
    height: 16px;
    background: #9d3a3a;
    border-radius: 8px;
    position: absolute;
    .seperator-time {
      font-size: 24px;
      font-weight: bold;
      margin-left: 30px;
      margin-top: -10px;
      } 
    }
}

</style>
