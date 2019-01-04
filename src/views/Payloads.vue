<template>
  <div class="default-payloads">
    <b-row class="top-10">
      <b-col cols="12">
        <PayloadTiles></PayloadTiles>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import PayloadTiles from "@/components/PayloadTiles";

export default {
  name: "Payloads",
  data(){
    return {
    }
  },
  components: {
    PayloadTiles
  }
  
};
</script>
