<template>
 <div id="actor-overview">
    <b-card class="mapping-card-actors" header="Actor Details">
      <b-list-group flush>
        <b-list-group-item>
          <b-row>
            <b-col cols="2"><b>ID</b></b-col>
            <b-col>{{actor_id}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col cols="2"><b>Name</b></b-col>
            <b-col>{{actor_name}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col cols="2"><b>Description</b></b-col>
            <b-col>{{actor_description}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col cols="2"><b>Aliases</b></b-col>
            <b-col>{{actor_aliases.join(', ')}}</b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    

    <div v-for="(techniques, phase) in technique_order" :key="phase">
      <div class="card mapping-card-mitre" v-if="techniques.length > 0">
        <div class="card-header bg-dark text-light">
          {{phase}}
          <span class="float-right">  
            <b-badge href="#" v-b-toggle="phase"  pill variant="light">{{techniques.length}}</b-badge>
          </span>
        </div>
      </div>

      <b-collapse :id="phase" class="mt-2">
        <div v-for="(technique, mapping) in techniques">
          <b-card class="mapping-card-mitre" :header="technique.technique_name" header-text-variant="white" header-bg-variant="dark-child">
            <b-list-group flush>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Name</b></b-col>
                  <b-col>{{technique.name}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Reference ID</b></b-col>
                  <b-col>{{technique.external_id}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Platform</b></b-col>
                  <b-col>{{technique.platform}}</b-col>
                </b-row>
              </b-list-group-item>
              <b-list-group-item>
                <b-row>
                  <b-col><b>Phase</b></b-col>
                  <b-col>{{technique.kill_chain_phase}}</b-col>
                </b-row>
              </b-list-group-item>
    
              <b-list-group-item >
                <b-row>
                  <b-col><b>Description</b></b-col>
                  <b-col>{{technique.description}}</b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
            <b-row class="top-10">
              <b-col>
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
              </b-col>
            </b-row>
          </b-card>
        </div>
      </b-collapse>
    </div>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "ActorOverview",
  data() {
    return {
      actor_name: '',
      actor_description: '',
      actor_aliases: [],
      actor_id: '',
      technique_order: {},
      command_fields: ['name', {key:'input', class:'cmdinput'}, 'sleep'],
      selected_phase: '',
    };
  },
  created() {
    EventBus.$on("get_actor_flow", actor => {
      this.get_actor_details(actor)
      this.get_mapping_flow(actor)
    });
  },
  beforeDestroy(){
    EventBus.$off('get_actor_flow')
  },
  methods: {
    get_actor_details(actor) {
      var actor_url = `/mitre/actors/` + actor
      this.$http
        .get(actor_url)
        .then(response => this.parse_actor_details(response['data']))
    },
    parse_actor_details(actor) {
      this.actor_name = actor.name
      this.actor_id = actor.actor_id
      this.actor_aliases = actor.aliases
      this.actor_description = actor.description
    },
    get_mapping_flow(actor) {
      this.$http
        .get(`mapping/actors/${actor}`)
        .then(response => this.display_mapping_flow(response.data))
    },
    display_mapping_flow(result) {
      this.technique_order = {
        'initial-access': [],
        'execution': [],
        'persistence': [],
        'privilege-escalation': [],
        'defense-evasion': [],
        'credential-access': [],
        'discovery': [],
        'lateral-movement': [],
        'collection': [],
        'exfiltration': [],
        'command-and-control': []
      }
      result.forEach(technique => {
        this.technique_order[technique.kill_chain_phase].push(technique)
      });
    },
  }
};
</script>

<style lang="scss" scoped>

#actor-overview {
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


</style>
