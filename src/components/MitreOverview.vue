<template>
  <div class="mitre-overview">
    
    <b-row class="top-10">
      <b-col>
        <b-card header="filter mitre" header-tag="header">
          <p class="card-text">Filter the mitre table for specific attack simulations</p>
          <b-form method="get" @submit.prevent="filter_mite">
            <b-row>
              <b-col xl="3" lg="5" md="6" sm="6">
                <b-form-radio-group id="platform-select" buttons :options="platform_options" button-variant="primary-reversed" v-model="mitre_search_platform">
                </b-form-radio-group>
              </b-col>
              <b-col xl="9" lg="7" md="4" sm="6">
                <b-form-select :options="technique_options" required v-model="mitre_search_phase"/>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>

    <b-row class="top-10">
      <b-col cols="12">
        <b-card-group columns>
          <b-card :header="mitre_phase.kill_chain_phase + ': ' + mitre_phase.platform" v-for="mitre_phase in filter_mitre_techniques">
            <b-list-group flush>
              <b-list-group-item v-for="mitre_technique in mitre_phase.techniques">{{mitre_technique.name}}</b-list-group-item>
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
        { text: "Any", value: "" },
        { text: "Windows", value: "windows" },
        { text: "Mac", value: "macos" },
        { text: "Linux", value: 'linux' },
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
      mitre_search_technique: '',
      mitre_search_phase: '',
      mitre_search_platform: '',
      error: false
    }
  },
  mounted (){
    this.$http
        .get('mitre/aggregate')
        .then(response => this.parse_mitre(response))
        .catch(response => this.generic_failed(response))
  },
  methods: {
    parse_mitre (response){
     this.mitre_techniques = response.data;
    },
    generic_failed (response){
      this.error = "Unable to perform request";
    }
  },
  computed: {
    filter_mitre_techniques (){
      var mitre_techniques_filtered = [];
      var filtered_techniques = this.mitre_techniques.filter(mitre_phase => 
        mitre_phase.kill_chain_phase.toLowerCase().includes(this.mitre_search_phase.toLowerCase()) &&
        mitre_phase.platform.toLowerCase().includes(this.mitre_search_platform.toLowerCase())
      )
      return filtered_techniques;
    }

  }
};
</script>
