<template>
  <b-card header="mitre selection" header-tag="header">
    <p class="card-text">Select technique to issue to agent(s)</p>
    <b-form method="post" @submit.prevent="submit_task">
      <b-row>
        <b-col cols="6">
          <MitreDropdown></MitreDropdown>
        </b-col>
        <b-col>
          <b-button type="submit" variant="primary" class="fullwidth">Add</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import MitreDropdown from "@/components/MitreDropdown";
export default {
  name: "MitreScheduler",
  data(){
    return {
      mitre_options: [
      ]
    }
  },
  components: {
    MitreDropdown,
  }
  
};
</script>
