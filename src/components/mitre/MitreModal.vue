<template>
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
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "MitreModal",
  data(){
    return {
      mitre_technique_details: false,
      error: false
    }
  },
  created (){
   EventBus.$on('showtechnique', technique_details => {
     this.parse_technique_details(technique_details);
   })
  },
  methods: {
    get_technique_details (technique_id){
      this.$http
        .get('mitre/technique/' + technique_id)
        .then(response => this.parse_technique_details(response))
        .catch(error => EventBus.$emit('showalert', error.response))
    
    },
    parse_technique_details (response){
      this.mitre_technique_details = response.data;
      this.$refs.techniquedetails.show();
    }
  },
};
</script>
