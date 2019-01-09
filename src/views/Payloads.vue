<template>
  <div class="default-payloads">
    <b-row class="top-10">
      <b-col cols="12">
        <PayloadOverview></PayloadOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import PayloadOverview from "@/components/payload/PayloadOverview";

export default {
  name: "Payloads",
  data() {
    return {};
  },
  components: {
    PayloadOverview
  }
};
</script>
