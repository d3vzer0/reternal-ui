<template>
  <b-row>
    <b-col cols="12">
      <b-table striped ref="detailstable" hover :fields="output" :items="search_results" :current-page="current_page" :per-page="limit">
        <template slot="show_details" slot-scope="row">
          <b-button size="sm" @click.stop="row.toggleDetails" variant="primary" class="mr-2">
          {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
          </b-button>
        </template>
        <template slot="row-details" slot-scope="row">
          <b-card>
            <b-row class="">
              <b-col>
                <b>Command</b>
              </b-col>
              <b-col>
               <b>Input</b>
              </b-col>
              <b-col>
               <b>Sleep</b>
              </b-col>
            </b-row>
            <b-row v-for="command in row.item.commands">
              <b-col>{{command.name}}</b-col>
              <b-col>{{ command.input }}</b-col>
              <b-col>{{ command.sleep }}</b-col>
            </b-row>
          </b-card>
        </template>
      </b-table>
      <b-row>
        <b-col md="8" offset-md="1">
          <b-pagination :total-rows="search_count" :per-page="limit" v-model="current_page" @click.native="get_results"/>
        </b-col>
      </b-row>
    </b-col>
  </b-row>    
</template>

<script>
import _ from "lodash";
import EventBus from "@/eventbus";

export default {
  name: "GenericTable",
  props: ["filter", "output", "expectedfields", "limit", "target", "countloc", "dataloc", "details", "tabletype"],
  data() {
    return {
      selected_agent: this.$route.params.agent_id,
      search_value: "",
      search_count: 0,
      current_page: 1,
      search_results: []
    };
  },
  methods: {
    get_results(page){
      const current_page = page ? page : this.current_page;
      var skip_results = (current_page * this.limit) - this.limit;
      var query_parameters = {
        beacon_id: this.$route.params.agent_id,
        skip: skip_results,
        limit: this.limit
      }
      this.$http
        .get(this.target, {params:query_parameters})
        .then(response => this.parse_results(response))
    },
    parse_results(response){
      var data = response.data;
      let items = _.get(data, this.dataloc)
      this.search_count = _.get(data, this.countloc)
      items.forEach(element => {
        var field_mapping = {}
        for (const [key, value] of Object.entries(this.expectedfields)) {
          if (key == "timestamp"){
            _.set(element, key, this.to_unix(_.get(element, value)))
          }
          if (key == "command_count" || key == "result_count"){
            _.set(element, key, _.get(element, value).length)
          } 
          field_mapping[key] = _.get(element, key);
        }
        this.search_results.push(field_mapping)
      })
    },

    to_unix(unix_timestamp) {
      var from_miliseconds = unix_timestamp / 1000;
      var datetime = this.$moment
        .unix(from_miliseconds)
        .format("YYYY-MM-DD HH:mm:ss");
      return datetime;
    }
  },
  mounted() {
    this.get_results();
  }
};
</script>

<style lang="scss">
.table {
  background-color: white;
}

.details-header {
  font-weight: 600;
}

.pagination {
  .page-link {
    color: #9d3a3a;
  }
  .page-item {
    &.active {
      .page-link {
        background-color: #9d3a3a;
        border-color: white;
      }
    }
  }
}

.nav-item {
  a {
    color: #495057;
  }
}

.tabs {
  .nav-link {
    &.active {
      color: #9d3a3a;
    }
  }
}
</style>
