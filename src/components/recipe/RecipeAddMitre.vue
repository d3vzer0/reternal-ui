<template>
  <b-card header="mitre selection" header-tag="header">
    <p class="card-text">Add MITRE technique to recipe</p>
    <b-form method="post" @submit.prevent="submit_task">
      <b-row>
        <b-col>
          <MitreDropdown></MitreDropdown>
        </b-col>
        <b-col cols="3">
          <b-form-input type="text" placeholder="0"></b-form-input>
        </b-col>
        <b-col cols="3">
          <b-button type="submit" variant="primary" class="fullwidth">Add</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import MitreDropdown from "@/components/mitre/MitreDropdown";
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
