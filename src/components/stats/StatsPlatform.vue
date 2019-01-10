<template>
  <b-card class="platformcard" header-tag="header">
    <platform-chart :chart-data="datacollection" :height="150"></platform-chart>
  </b-card>
</template>

<script>
import PlatformChart from "@/components/stats/Platform.js";

export default {
  components: {
    PlatformChart
  },
  data() {
    return {
      datacollection: null
    };
  },
  mounted() {
    this.get_platforms();
  },
  methods: {
    get_platforms() {
      this.$http
        .get("stats/platforms")
        .then(response => this.parse_platforms(response))
        .catch(response => this.generic_failed(response));
    },
    parse_platforms(response) {
      var collection = {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ["#9a4f4f", "#6c4848 ", "#d78f8f"],
            hoverBackgroundColor: ["#a16969", "#38423b", "#38423b"]
          }
        ]
      };
      response.data.forEach(platform => {
        collection.labels.push(platform["_id"]);
        collection.datasets[0]["data"].push(platform["count"]);
      });
      this.datacollection = collection;
    }
  }
};
</script>

<style lang="scss" scoped>
.platformcard {
  height: 230px;
}
  
</style>
