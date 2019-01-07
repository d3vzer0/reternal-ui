<template>
  <div class="agent-details top-10">
      <b-row class="top-10">
      <b-col>
        <b-card header="filter output" header-tag="header">
          <p class="card-text">Filter beacon history depending on the task output</p>
          <b-form method="get" @submit.prevent="filter_mite">
            <b-row>
              <b-col cols="12">
                <b-form-input type="text" v-model.lazy="details_search_generic" @keyup.native="get_details_filtered" placeholder="Username or Hostname"></b-form-input>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
        <b-table striped ref="detailstable" hover :fields="fields" :items="get_details_filtered" :current-page="details_current_page" :per-page="details_search_limit">
          <template slot="show_details" slot-scope="row">
            <b-button size="sm" @click.stop="row.toggleDetails" variant="primary" class="mr-2">
            {{ row.detailsShowing ? 'Hide' : 'Show'}} Details
            </b-button>
          </template>
          <template slot="row-details" slot-scope="row">
            <b-card>
              <b-row class="details-header">
                <b-col>
                  Command
                </b-col>
                <b-col>
                  Input
                </b-col>
                <b-col>
                  Sleep
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
          <b-col md="6">
            <b-pagination :total-rows="details_result_count" :per-page="details_search_limit" v-model="details_current_page" @click.native="get_details_filtered"/>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Vue from "vue";
Vue.use(require("vue-moment"));

export default {
  name: "AgentDetails",
  data(){
    return {
      selected_agent: this.$route.params.agent_id,
      details_search_generic: "",
      details_search_limit: 15,
      details_result_count: 0,
      details_current_page: 1,
      fields: {
        timestamp: {label: "Timestamp"},
        name: {label: "Task name"},
        task_status: {label:"Status"},
        command_count: {label: "Commands in task"},
        result_count: {label:"Commands executed"},
        show_details: {label:"Details"}
      }

    }
  },
  methods: {
    get_details_filtered (ctx){
      var skip_results = (this.details_current_page * this.details_search_limit) - this.details_search_limit;
      let promise = this.$http
        .get("results", {params:{beacon_id: this.selected_agent, skip: skip_results, 
            limit: this.details_search_limit,
            search:this.details_search_generic}})
      return promise.then((data)=> {
        let items = data.data;
        this.details_result_count = data.data.count;
        var results = [];
        items.forEach(detail => {
          var datetime = this.from_unix(detail.start_date["$date"]);
          var result = {
            timestamp: datetime,
            name: detail.name,
            task_status: detail.task_status,
            command_count: detail.commands.length,
            result_count: detail.output.length,
            commands: detail.commands,
            _showDetails: false
          }
          results.push(result);
        });
        return(results || [])
      })
    },

    from_unix(unix_timestamp){
      var from_miliseconds = unix_timestamp / 1000;
      var datetime = this.$moment.unix(from_miliseconds).format('YYYY-MM-DD HH:mm:ss');
      return datetime;
    }
  },
  mounted (){
    this.get_details_filtered()
  }
  
};
</script>

<style lang="sass">
.table
  background-color: white

.details-header
  font-weight: 600
</style>
