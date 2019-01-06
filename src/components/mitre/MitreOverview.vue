<template>
  <b-card-group columns>
    <b-card :header="mitre_phase._id.kill_chain_phases" v-for="mitre_phase in mitre_techniques">
      <b-list-group flush>
        <b-list-group-item v-for="mitre_technique in mitre_phase.techniques">
          <b-row>
            <b-col cols="10">{{mitre_technique.name}}</b-col>
            <b-col cols="2" @click="show_technique(mitre_technique.technique_id)" class="awesome-primary"><font-awesome-icon icon="info" /></b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>
</template>

<script>
import _ from 'lodash'; 
import EventBus from "@/eventbus";

export default {
  name: "MitreOverview",
  data(){
    return {
      mitre_techniques: [
      ],
      search_technique: "",
      search_phase: "",
      search_platform: "Windows",
    }
  },
  created (){
   EventBus.$on('refreshmitre', filters => {
     this.change_filters(filters);
   })
  },
  mounted (){
   this.get_techniques_filtered();
  },
  methods: {
    get_techniques_filtered: _.debounce(function (){
      this.$http
        .get('mitre/techniques', {params:{name:this.search_technique,
              phase:this.search_phase,
              platform:this.search_platform}})
        .then(response => this.parse_mitre(response))
        .catch(error => EventBus.$emit('showalert', error.response))
    },200),
    parse_mitre (response){
     this.mitre_techniques = response.data;
    },
    generic_failed (response){
      this.error = "Unable to perform request";
    },
    change_filters(filters){
      this.search_technique = filters.technique;
      this.search_platform = filters.platform;
      this.search_phase = filters.phase;
      this.get_techniques_filtered();
    },
    show_technique(technique_id){
      EventBus.$emit('showtechnique', technique_id)
    }
  }
};
</script>
