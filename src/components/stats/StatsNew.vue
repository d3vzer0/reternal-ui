<template>
  <b-card class="newcard" header="Agents last vs This week" header-tag="header">
    <b-row>
      <b-col xl="4" lg="4" md="4">
        <p class="oldcount">{{old_count}}</p>
      </b-col>
      <b-col xl="4" lg="4" md="4">
        <p class="newarrow"><font-awesome-icon icon="arrow-right" /></p>
      </b-col>
      <b-col xl="4" lg="4" md="4">
        <p class="newcount">{{ new_count }}</p>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  name: "StatsAgent",
  data() {
    return {
      old_count: 0,
      new_count: 0
    };
  },
  mounted() {
    this.get_new();
  },
  methods: {
    get_new() {
      this.$http
        .get("stats/new")
        .then(response => this.parse_new(response))
        .catch(response => this.generic_failed(response));
    },
    parse_new(response) {
      if (response.data.this_week.length > 0) {
        this.new_count = response.data.this_week[0].beacon_count;
      }
      if (response.data.last_week.length > 0) {
        this.old_count = response.data.last_week[0].beacon_count;
      }
    }
  }
};
</script>

<style lang="sass">

.newcard
  height: 230px
  font-size: 80px
  .newcount
    margin-right: 40%
    color: green
    float: right

  .oldcount
    float: left
    color: red
    margin-left: 40%

  .newarrow
    text-align: center

    

</style>
