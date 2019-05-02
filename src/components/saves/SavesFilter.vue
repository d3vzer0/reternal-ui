<template>
  <div class="card mapping-card">
    <div class="card-header mapping-card-header">
      <font-awesome-icon icon="save" />
    </div>
    <div class="card-body mapping-card-body">
      <b-form-input v-model="campaign_filter" placeholder="Campaign search"></b-form-input>
      <b-list-group>
        <b-list-group-item v-for="campaign in filtered_campaigns" href="#" v-on:click="search_campaign(campaign)" :active="campaign === selected_campaign">{{campaign}}</b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "ActorFilter",
  data() {
    return {
      campaign_options: [],
      campaign_filter: '',
      selected_campaign: '',
    };
  },
  computed: {
    filtered_campaigns () {
      return this.campaign_options.filter(campaign => {
        return campaign.toLowerCase().includes(this.campaign_filter.toLowerCase())
      })
    }
  },
  beforeDestroy(){
    EventBus.$off('refresh_campaigns')
  },
  created (){
    this.get_campaigns(),
    EventBus.$on("refresh_campaigns", _ => {
      this.campaign_options = []
      this.get_campaigns()
    })
  },
  methods: {
    get_campaigns(){
      this.$http
        .get("recipes")
        .then(response => this.parse_campaigns(response))
    },
    search_campaign(campaign) {
      this.selected_campaign = campaign
      EventBus.$emit('get_campaign', campaign)
    },
    parse_campaigns(campaigns) {
      campaigns.data.forEach(campaign => {
        this.campaign_options.push(campaign.name)
      });
    }
  }
}
</script>

<style lang="scss" scoped>
#platform-filter {
  max-width: 250px;
}

.mapping-card {
  .list-group {
    max-height: 80vh;
    margin-bottom: 10px;
    overflow-x: hidden; 
    .list-group-item {
      border-radius: 0px;
    }
  }
  .mapping-card-body {
    padding: 0;
    .list-group{
      .list-group-item {
        &.active {
          border: 0px;
          background-color: #9e1c1d;
        }
      }
    }
    .platform-select {
      border-radius: 0px;
    }
  }
  .mapping-card-header{
    border-radius: 0px;
    border: 2px;
    border-width: 3px;
    text-align: center;
    background-color: #f4f2f2;
    color: #4c5c68;
    font-size: 60px;
  }
}

</style>
