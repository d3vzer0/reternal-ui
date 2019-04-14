<template>
 <b-row id="mapping-overview" class="justify-content-center">
   <b-col cols="7">
        <div v-for="(technique, mapping) in techniques">
          <div class="card">
            <div class="card-header bg-dark-child text-light">
              {{technique.technique_name}}
              <span class="float-right">  
                <b-badge href="#" @click="add_to_recipe(technique)" pill variant="light"><font-awesome-icon icon="plus" /></b-badge>
              </span>
            </div>
            <div class="card-body">
              <b-list-group flush>
              <b-list-group-item>
                <b-row>
                  <b-col cols="2"><b>Name</b></b-col>
                  <b-col>{{technique.name}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col cols="2"><b>Reference ID</b></b-col>
                  <b-col>{{technique.external_id}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col cols="2"><b>Platform</b></b-col>
                  <b-col>{{technique.platform}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col cols="2"><b>Phase</b></b-col>
                  <b-col>{{technique.kill_chain_phase}}</b-col>
                </b-row>
              </b-list-group-item>
    
              <b-list-group-item >
                <b-row>
                  <b-col cols="2"><b>Description</b></b-col>
                  <b-col>{{technique.description}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item >
                <div v-for="command in technique.commands">
                  <b-row>
                    <b-col cols="10">
                      <b-list-group flush>
                        <b-list-group-item>
                          <b-row class="top-10">
                            <b-col cols="2"><b>{{command.name}}</b></b-col>
                            <b-col class="cmdinput">{{command.input}}</b-col>
                          </b-row>
                        </b-list-group-item>
                      </b-list-group>
                    </b-col>
                    <b-col offset="1" cols="1" class="command-seperator">
                      <div class="seperator-line">
                      </div>
                      <div class="seperator-circle">
                        <div class="seperator-time">
                          {{ command.sleep }}
                        </div>
                      </div>
                    </b-col>
                  </b-row>
                </div>
                </b-list-group-item >
              </b-list-group>
            </div>
          </div>
        </div>

   <!-- <b-row >
      <b-col offset="1" cols="1" class="command-seperator">
        </b-col>
        <b-col cols="6">
          <b-card class="mapping-card-mitre" header="Details">
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
      </b-row> -->

    <!-- <div v-for="command in mapping_details.commands">
      <b-row>
        <b-col offset="2" cols="6">
          <b-card class="mapping-card-technique" :header="command.name" header-bg-variant="dark" header-text-variant="white">
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
        <b-col offset="1" cols="1" class="command-seperator">
          <div class="seperator-line">
          </div>
          <div class="seperator-circle">
            <div class="seperator-time">
              {{ command.sleep }}
            </div>
          </div>
        </b-col>
      </b-row>
    </div> -->
    </b-col>
  </b-row>
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
      techniques: [],
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
      console.log(filters)
      this.$http
        .get("technique", {
          params: {
            phase: filters.phase,
            platform: filters.platform,
            technique: filters.technique,
          }
        })
        .then(response => this.display_mapping_flow(response.data))
    },
    display_mapping_flow(result) {
      this.techniques = result
      // this.mapping_details.details = result[0];
      // this.$set(this.mapping_details, 'commands', result[0].commands);
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


#mapping-overview {
  .cmdinput {
    word-break: break-all;
  }
  .seperator-circle {
    height: 20px;
  }
  .card {
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

</style>
