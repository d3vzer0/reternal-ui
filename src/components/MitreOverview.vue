<template>
  <div class="mitre-overview">
     <b-modal ref="techniquedetails" id="techniquemodal" size="lg" hide-footer :title="mitre_technique_details.technique_id">
         <table class="table">
           <tr>
             <td>Name</td>
             <td>{{mitre_technique_details.name}}</td>
          </tr>
          <tr>
             <td>Platforms</td>
             <td v-if="mitre_technique_details.platforms">{{mitre_technique_details.platforms.join(', ')}}</td>
          </tr>
          <tr>
             <td>Phases</td>
             <td v-if="mitre_technique_details.kill_chain_phases">{{mitre_technique_details.kill_chain_phases.join(', ')}}</td>
          </tr>
          <tr>
             <td>Permissions</td>
             <td v-if="mitre_technique_details.permissions_required">{{mitre_technique_details.permissions_required.join(', ')}}</td>
          </tr>
         <tr>
             <td>DataSource</td>
             <td v-if="mitre_technique_details.data_sources">{{mitre_technique_details.data_sources.join(', ')}}</td>
          </tr>            
          <tr>
             <td>Description</td>
             <td><pre>{{mitre_technique_details.description}}</pre></td>
          </tr>

         </table>
    </b-modal>

    <b-row class="top-10">
      <b-col>
        <b-card header="filter mitre" header-tag="header">
          <p class="card-text">Filter the mitre table for specific attack simulations</p>
          <b-form method="get" @submit.prevent="filter_mite">
            <b-row>
              <b-col xl="2" lg="3" md="4" sm="6">
                <b-form-radio-group id="platform-select" v-model="mitre_search_platform" @change="get_techniques_filtered" buttons :options="platform_options" button-variant="primary-reversed">
                </b-form-radio-group>
              </b-col>
              <b-col xl="4" lg="5" md="4" sm="2">
                <b-form-select :options="technique_options" v-model="mitre_search_phase" @change="get_techniques_filtered" required />
              </b-col>
              <b-col xl="6" lg="4" md="4" sm="4">
                <b-form-input type="text" v-model.lazy="mitre_search_technique" @keyup.native="get_techniques_filtered" placeholder="Technique name"></b-form-input>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="top-10">
      <b-col cols="12">
        <b-card-group columns>
          <b-card :header="mitre_phase._id.kill_chain_phases" v-for="mitre_phase in mitre_techniques">
            <b-list-group flush>
              <b-list-group-item v-for="mitre_technique in mitre_phase.techniques">
                <b-row>
                  <b-col cols="11">{{mitre_technique.name}}</b-col>
                  <b-col cols="1" @click="get_technique_details(mitre_technique.technique_id)" class="awesome-primary"><font-awesome-icon icon="info" /></b-col>
                </b-row>
              </b-list-group-item>
            </b-list-group>
          </b-card>
        </b-card-group>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  name: "MitreOverview",
  data(){
    return {
      platform_options: [
        { text: "Windows", value: "Windows" },
        { text: "Mac", value: "macOS" },
        { text: "Linux", value: 'Linux' },
      ],
      technique_options: [
        { text: "Any", value: "" },
        { text: "initial-access", value :"initial-access" },
        { text: "execution", value :"execution" },
        { text: "persistences", value :"persistence" },
        { text: "privilege-escalation", value :"privilege-escalation" },
        { text: "defense-evasion", value :"defense-evasion" },
        { text: "credential-access", value :"credential-access" },
        { text: "discovery", value :"discovery" },
        { text: "lateral-movement", value :"lateral-movement" },
        { text: "exfiltration", value :"exfiltration" },
        { text: "collection", value :"collection" },
        { text: "command-and-control", value :"command-and-control" },
      ],
      mitre_techniques: [
      ],
      mitre_search_technique: "",
      mitre_search_phase: "",
      mitre_search_platform: "Windows",
      mitre_technique_details: false,
      error: false
    }
  },
  mounted (){
   this.get_techniques_filtered();
  },
  methods: {
    get_techniques_filtered (){
      setTimeout(() =>
        this.$http
          .get('mitre/techniques', {params:{name:this.mitre_search_technique,
               phase:this.mitre_search_phase,
               platform:this.mitre_search_platform}})
          .then(response => this.parse_mitre(response))
          .catch(response => this.generic_failed(response))
      ,200);
    },
    get_technique_details (technique_id){
      this.$http
        .get('mitre/technique/' + technique_id)
        .then(response => this.parse_technique_details(response))
        .catch(response => this.generic_failed(response))
    
    },
    parse_technique_details (response){
      this.mitre_technique_details = response.data;
      this.$refs.techniquedetails.show();
    },

    parse_mitre (response){
     this.mitre_techniques = response.data;
    },
    generic_failed (response){
      this.error = "Unable to perform request";
    }
  },
  computed: {
    filter_mitre_techniques (){
      var filtered_techniques = this.mitre_techniques.filter(mitre_phase => 
        mitre_phase.kill_chain_phase.toLowerCase().includes(this.mitre_search_phase.toLowerCase()) &&
        mitre_phase.platform.toLowerCase().includes(this.mitre_search_platform.toLowerCase())
      )
      return filtered_techniques;
    }
  }
};
</script>
