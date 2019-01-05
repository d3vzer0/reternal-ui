<template>
  <div class="mitre">
    <MitreModal></MitreModal>
    <b-row class="top-10">
      <b-col cols="12">
        <MitreFilter></MitreFilter>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
        <MitreOverview></MitreOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import MitreFilter from "@/components/mitre/MitreFilter";
import MitreOverview from "@/components/mitre/MitreOverview";
import MitreModal from "@/components/mitre/MitreModal";

export default {
  name: "Mitre",
  data(){
    return {
    }
  },
  components: {
    MitreModal,
    MitreOverview,
    MitreFilter
  }
  
};
</script>
