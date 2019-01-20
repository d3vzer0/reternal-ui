<template>
  <div class="agent-details top-10">
      <b-row class="top-10">
      <b-col>
        <b-card header="filter output" header-tag="header">
          <p class="card-text">Filter beacon history depending on the task output</p>
          <b-form method="get" @submit.prevent="filter_mite">
            <b-row>
              <b-col cols="3">
                <vue-ctk-date-time-picker DatePicker v-model="start_date"
                 time-format="HH:mm" format="X" color="#9d3a3a" label="Start date/time">
                </vue-ctk-date-time-picker>
              </b-col>
              <b-col cols="3">
                <vue-ctk-date-time-picker DatePicker v-model="end_date"
                  time-format="HH:mm" format="X" color="#9d3a3a" label="End date/time">
                </vue-ctk-date-time-picker>
              </b-col>
              <b-col cols="6">
                <b-form-input type="text" v-model="search_name" @keyup.native="filter_results" placeholder="Task name"></b-form-input>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
        <b-card no-body>
          <b-tabs card>
            <b-tab no-body title="Tasks status" active>
              <tasks-overview></tasks-overview>
            </b-tab>
            <b-tab no-body title="Text Output">
              <TasksText></TasksText>
            </b-tab>
            <b-tab no-body title="Image Galery" class="taskgalery">
              <b-row class="top-10">
                <b-col cols="12">
                  <TasksGalery></TasksGalery>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab no-body title="File uploads">
            </b-tab>
          </b-tabs>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
import TasksOverview from "@/components/tasks/TasksOverview";
import TasksGalery from "@/components/tasks/TasksGalery";
import TasksText from "@/components/tasks/TasksText";
import EventBus from "@/eventbus";
import Vue from "vue";
Vue.use(require("vue-moment"));


export default {
  name: "TaskResults",
  data() {
    return {
      search_name: "",
      start_date: this.$moment().subtract(3, 'days').format('%X'),
      end_date: this.$moment().format('%X'),
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
  methods: {
    filter_results: _.debounce(function() {
      EventBus.$emit('changetaskfilter', this.search_name);
    }, 300),
  },
  
  components: {
    TasksOverview,
    TasksGalery,
    TasksText,
    VueCtkDateTimePicker
  },
};
</script>

<style lang="scss">
.table {
  background-color: white;
}

.details-header {
  font-weight: 600;
}

.taskgalery {
  padding: 20px;
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
