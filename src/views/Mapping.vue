<template>
  <div class="mitre">
    <b-row class="top-10">
      <b-col cols="12">
        <MappingFilter></MappingFilter>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
        <MappingOverview></MappingOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import MappingFilter from "@/components/mapping/MappingFilter";
import MappingOverview from "@/components/mapping/MappingOverview";

export default {
  name: "MitreMapping",
  data() {
    return {};
  },
  components: {
    MappingOverview,
    MappingFilter
  }
};
</script>
