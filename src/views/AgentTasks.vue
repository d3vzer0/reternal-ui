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
        <b-card no-body>
          <b-tabs card>
            <b-tab no-body title="Tasks status" active>
              <tasks-overview></tasks-overview>
            </b-tab>
            <b-tab no-body title="Text Output">
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

import TasksOverview from "@/components/tasks/TasksOverview";
import TasksGalery from "@/components/tasks/TasksGalery";

export default {
  name: "AgentDetails",
  data() {
    return {
      details_search_generic: "",
    };
  },
  components: {
    TasksOverview,
    TasksGalery
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
