<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row justify-around">
      <!-- Filter column -->
      <div class="col-3 q-pr-md">
        <div class="row q-mb-md">
          <div class="col-12">
            <q-card flat style="height: 220px">
              <q-card-section>
                <q-table
                  flat
                  hide-bottom
                  :data="platforms"
                  :columns="columnsPlatform"
                  row-key="name"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <q-card flat style="height: 280px">
              <q-card-section>
                <q-table
                  style="height: 260px"
                  flat
                  hide-bottom
                  :data="techniques"
                  :columns="columnsTechniques"
                  :pagination.sync="pagination"
                  :rows-per-page-options="[0]"
                  virtual-scroll
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col-9">
        <div class="row">
          <div class="col-12">
             <q-table
          flat
          dense
          title="Scheduled tasks"
          :data="tasks"
          :columns="columnsTasks"
          row-key="name"
          class="tasks-table"
        />
          </div>
        </div>
        <div class="row">
          <div class="col-12 dag">
            <q-card flat>
              <network :nodes="nodes" :edges="edges" :options="options"
                    :events="['select']"
                  >
              </network>
            </q-card>
          </div>
        </div>
      </div>
      <!-- <div class="col">
      </div> -->
    <!-- <div class="row q-pa-md q-mt-md justify-around">
      <div class="col-11">
        <q-table
          flat
          title="Scheduled tasks"
          :data="tasks"
          :columns="columnsTasks"
          row-key="name"
          class="tasks-table"
        />
      </div> -->
    </div>
  </q-page>
</template>

<script>
import { Network } from 'vue2vis'

export default {
  name: 'PageIndex',
  components: {
    Network
  },
  computed: {
    filtered_ca: function () {
      return this.options.filter(ca => ca.label.includes(this.search_ca))
    },
    filter_tags: function () {
      return this.tag_options.filter(tag => tag.includes(this.search_tag))
    },
    integrationOptions: {
      get () {
        return this.$store.state.integrations.integrationOptions
      }
    },
    nodes: {
      get () {
        return this.$store.state.tasks.nodes
      }
    },
    edges: {
      get () {
        return this.$store.state.tasks.edges
      }
    }
  },
  data () {
    return {
      slide: 'style',
      pagination: {
        rowsPerPage: 0
      },
      options:
      {
        height: '400px',
        width: '100%',
        autoResize: true,
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'LR',
            sortMethod: 'directed',
            parentCentralization: true
          }
        }
      },
      selectedIntegration: null,
      showDescription: false,
      techniques: [],
      tasks: [],
      platforms: [],
      columnsTasks: [
        { name: 'start_date', align: 'left', label: 'Start date', field: 'start_date', sortable: true },
        { name: 'task', align: 'right', label: 'Task', field: 'task', sortable: true },
        { name: 'campaign', align: 'right', label: 'Campaign', field: 'campaign', sortable: true },
        { name: 'state', align: 'right', label: 'State', field: 'state', sortable: true }

      ],
      columnsTechniques: [
        { name: '_id', align: 'left', label: 'Phase', field: '_id', sortable: true },
        { name: 'count', align: 'right', label: 'Techniques', field: 'count', sortable: true }
      ],
      columnsPlatform: [
        { name: '_id', align: 'left', label: 'Platform', field: '_id', sortable: true },
        { name: 'count', align: 'right', label: 'Techniques', field: 'count', sortable: true }
      ]
    }
  },
  created () {
    this.$getAgents()
    this.getTasks()
    this.getTechniquesCount()
    this.getPlatformCount()
  },
  methods: {
    getTasks () {
      this.$axios
        .get('/tasks')
        .then(response => this.getTasksSuccess(response['data']))
    },
    getTasksSuccess (response) {
      this.tasks = response
      response.forEach(task => {
        this.$store.commit('tasks/addNode', {
          id: task.task,
          label: task.task,
          shape: 'box',
          color: '#343a40',
          font: {
            color: 'white',
            size: 20
          },
          margin: 12
        })

        task.dependencies.forEach(dep => {
          this.$store.commit('tasks/addEdge', {
            from: dep,
            to: task.task,
            arrows: 'to',
            color: '#343a40',
            width: 3
          })
        })
        // console.log(task)
      })
    },
    getTechniquesCount () {
      this.$axios
        .get('/mapping/count?by=phase')
        .then(response => this.getTechniquesCountSuccess(response['data']))
    },
    getTechniquesCountSuccess (response) {
      this.techniques = response
    },
    getPlatformCount () {
      this.$axios
        .get('/mapping/count?by=platform')
        .then(response => this.getPlatformCountSuccess(response['data']))
    },
    getPlatformCountSuccess (response) {
      this.platforms = response
    }
  }
}
</script>

<style lang="scss">

.tasks-table {
  .q-table__top,
  thead tr:first-child th {
    border: none;
    background-color: $primary;
    color: white;
  }
}

</style>
