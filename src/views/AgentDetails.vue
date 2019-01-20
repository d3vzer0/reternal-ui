<template>
  <div class="agent-details top-10">
      <b-row class="top-10">
      <b-col>
        <b-card header="filter output" header-tag="header">
          <b-row>
            <b-col cols="6">
              <vue-ctk-date-time-picker DatePicker v-model="start_date"
                time-format="HH:mm" format="X" color="#9d3a3a" label="Start date/time">
              </vue-ctk-date-time-picker>
            </b-col>
            <b-col cols="6">
              <vue-ctk-date-time-picker DatePicker  v-model="end_date"
                time-format="HH:mm" format="X" color="#9d3a3a" label="End date/time">
              </vue-ctk-date-time-picker>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
          <ServerSide :dataloc="data_loc" :queryparams="query_params" :countloc="count_loc" :limit="limit" :filter="search_filter" :output="output" :expectedfields="expected_fields" :target="target_url"></ServerSide>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import ServerSide from "@/components/table/ServerSide";
import EventBus from "@/eventbus";
import Vue from "vue";
Vue.use(require("vue-moment"));

export default {
  name: "AgentDetails",
  data() {
    return {
      search_filter: "",
      start_date: this.$moment().subtract(3, 'days').format('%X'),
      end_date: this.$moment().format('%X'),
      query_params: {start_date: this.start_date,
          end_date: this.end_date},

      count_loc: "count",
      data_loc: "data",
      target_url: "history",
      limit: 30,
      expected_fields: {
        timestamp: "timestamp.$date",
        beacon_id: "beacon_id",
        username: "username",
        hostname: "hostname",
        remote_ip: "remote_ip",
        working_dir: "working_dir",
        _showDetails: false
      },
      output: {
        timestamp: { label: "Timestamp" },
        beacon_id: { label: "Beacon ID" },
        username: { label: "Username" },
        hostname: { label: "Hostname" },
        remote_ip: { label: "Remote IP" },
        working_dir: { label: "Working dir"}
      }
    
    };
  },
  watch: {
    start_date: function(start_date){
      this.start_date = start_date;
      EventBus.$emit('changestartdate', start_date);
    },
    end_date: function(end_date){
      this.end_date = end_date;
      EventBus.$emit('changeenddate', end_date);
    }
  },
  components: {
    ServerSide,
    VueCtkDateTimePicker
  },
  methods: {
      from_unix(unix_timestamp) {
      var from_miliseconds = unix_timestamp / 1000;
      var datetime = this.$moment
        .unix(from_miliseconds)
        .format("YYYY-MM-DD HH:mm:ss");
      return datetime;
    }
  }
};
</script>

<style lang="scss" scoped>

.table {
  background-color: white;
}

</style>
