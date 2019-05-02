<template>
  <div class="mapping-techniques">
    <div class="category" v-for="(techniques, category) in mapping.techniques" :key="category">
      <div :key="category" class="card mapping-card-mitre category-card" v-if="techniques.length > 0">
        <div class="card-header bg-light text-dark">
          {{category}}
          <span class="float-right">  
            <b-badge href="#" pill  v-b-toggle="category" variant="dark">{{techniques.length}}</b-badge>
          </span>
        </div>
      </div>
      <b-collapse :id="category">
        <div v-for="(technique, mapping) in techniques[0]" :key="mapping">
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
                <div v-for="(command, index) in technique.commands" :key="index">
                  <b-row>
                    <b-col cols="12">
                      <b-list-group flush>
                        <b-list-group-item>
                          <b-row class="top-10">
                            <b-col cols="2"><b>{{command.name}}</b></b-col>
                            <b-col class="cmdinput">{{command.input}}</b-col>
                            <b-col cols="2" class="text-right"><font-awesome-icon icon="clock" />  {{command.sleep}}</b-col>
                          </b-row>
                        </b-list-group-item>
                      </b-list-group>
                    </b-col>
                  </b-row>
                </div>
                </b-list-group-item >
              </b-list-group>
            </div>
          </div>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "MappingOverview",
  data() {
    return {
      mapping: {
        techniques: [],
      }
    };
  },
  created() {
    EventBus.$on("get_mapping_flow", filters => {
      this.mapping.techniques = {}
      this.get_mapping_flow(filters)
    });
  },
  beforeDestroy(){
    EventBus.$off('get_mapping_flow')
  },
  methods: {
    get_mapping_flow(filters) {
      this.$http
        .get("technique", {
          params: { phase: filters.phase, platform: filters.platform,
          technique: filters.technique }})
        .then(response => this.display_mapping_flow(response.data))
    },
    display_mapping_flow(result) {
      var categorize_mapping = {}
      result.forEach(mapping => {
        if(!(mapping.technique_name in categorize_mapping)){
          categorize_mapping[mapping.technique_name] = []
        }
        categorize_mapping[mapping.technique_name].push(result)
      })
      this.$set(this.mapping, 'techniques', categorize_mapping);
    },
    add_to_recipe(technique) {
      technique.commands.forEach(command => {
        var random_array = new Uint32Array(5);
        var random_id = window.crypto.getRandomValues(random_array)[2];
        var command_options = {
          reference_name: technique.name,
          reference_id: technique._id['$oid'],
          technique_name: technique.technique_name,
          kill_chain_phase: technique.kill_chain_phase,
          technique_id: technique.technique_id,
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
