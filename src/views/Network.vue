<template>
  <div class="network">
    <b-row class="top-10">
      <b-col cols="12">
        <NetworkOverview></NetworkOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import NetworkOverview from "@/components/network/NetworkOverview";

export default {
  name: "Network",
  components: {
    NetworkOverview
  }
};
</script>
