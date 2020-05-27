<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md row q-gutter-md justify-around">
      <div class="col">
        <q-card>
          {{ gridCols }}
          <!-- <q-tabs v-model="campaignTab" active-color="primary" indicator-color="primary" align="justify" class="text-grey">
            <q-tab name="scheduled" label="Scheduled"/>
            <q-tab name="processing" label="Processing" />
            <q-tab name="completed" label="Completed" />
          </q-tabs> -->
          <!-- <q-tab-panels v-model="campaignTab" animated>
            <q-tab-panel name="scheduled"> -->
              <q-card-section horizontal>
                <q-card-section class="col">
                  <q-table
                    title="Scheduled campaigns"
                    class="tasks-table"
                    flat
                    :data="campaigns"
                    :columns="columsCampaigns"
                    row-key="_id">
                    <!-- Custom header for expanding row -->
                    <template v-slot:header="props">
                      <q-tr :props="props">
                        <q-th auto-width />
                        <q-th v-for="col in props.cols" :key="col.name" :props="props">
                          {{ col.label }}
                        </q-th>
                      </q-tr>
                    </template>
                    <!-- Custom body containing button for row expansion -->
                    <template v-slot:body="props">
                      <q-tr :props="props">
                        <q-td auto-width>
                          <q-btn size="sm" unelevated color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                        </q-td>
                        <q-td v-for="col in props.cols" :key="col.name" :props="props">
                          {{ col.value }}
                        </q-td>
                        <q-td>
                          <q-icon size="sm" name="fas fa-project-diagram" v-on:click="drawCampaign(props.row.group_id)"></q-icon>
                        </q-td>
                      </q-tr>
                      <q-tr v-show="props.expand" :props="props">
                        <q-td colspan="100%">
                          <div class="task-lis">
                            <q-list separator>
                              <q-item class="text-left" v-for="(task, index) in props.row.tasks" v-bind:key="index">
                                <q-item-section avatar>
                                  <q-icon name="update"></q-icon>
                                </q-item-section>
                                <q-item-section>
                                  {{ task.name }}
                                </q-item-section>
                                <q-item-section side>
                                  <q-item-label caption>Queued, scheduled for {{ task.scheduled_date}}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </div>
                          <div class="dag" v-if="selectedCampaign === props.row.group_id">
                            <div class="div">
                               <q-table
                                grid
                                :data="attckData"
                                :columns="attckColumns"
                                row-key="name"
                                hide-header
                                :pagination.sync="attckPagination">
                                <template v-slot:item="props">
                                  <div class="q-pa-xs col-xs-12 col-sm-4 col-md-3">
                                    <q-card flat>
                                      <q-card-section class="bg-primary text-white">
                                      <div class="text-h7 text-bold">{{ props.row._id }}</div>
                                      </q-card-section>
                                      <q-separator />
                                      <q-card-section>
                                        <q-list separator>
                                          <q-scroll-area>
                                            <!-- <q-item v-for="(technique, index) in props.row.techniques" v-bind:key="index">
                                              <q-item-section>
                                                <q-item-label>
                                                  {{ technique.name }}
                                                </q-item-label>
                                                <q-item-label lines="1">
                                                  <span v-for="dsa in technique.data_sources_available" v-bind:key="dsa.id">
                                                    <q-icon name="grade" color="black"/>
                                                  </span>
                                                  <span v-for="ds in technique.data_sources" v-bind:key="ds.id">
                                                    <q-icon name="grade" color="grey"/>
                                                  </span>
                                                </q-item-label>
                                              </q-item-section>
                                              <q-item-section avatar>
                                                <q-btn icon="help_outline" flat color="primary" @click="getTechniqueDetails(technique.technique_id)" />
                                              </q-item-section>
                                            </q-item> -->
                                          </q-scroll-area>
                                        </q-list>
                                      </q-card-section>
                                    </q-card>
                                  </div>
                                </template>
                              </q-table>
                            </div>
                            <div class="dag-text" style="position: absolute; z-index: 100; padding: 20px;">
                              <!-- <div class="dag-text-title text-h5">
                                Campaign  <q-btn v-if="nodes.length > 0" flat icon="play_circle_outline" @click="showScheduleScenario = true" /> <q-btn v-if="nodes.length > 0" flat icon="save" @click="showSaveGraph = true" />
                              </div>
                              <div class="dag-text-message text-h7" v-if="nodes.length === 0 ">
                                No scenarios have been added to the campaign
                              </div> -->
                              <!-- <div class="dag-text-content text-h7 q-mt-md" v-if="nodes.length > 0 && selectedTask">
                                <table>
                                  <tr>
                                    <td>Name</td>
                                    <td>{{ taskDetails.id }}<q-btn v-on:click="deleteTask()" dense unelevated icon="delete" size="sm"/></td>
                                  </tr>
                                  <tr>
                                    <td>Time</td>
                                    <td>{{ taskDetails.taskData.start_date }}</td>
                                  </tr>
                                  <tr>
                                    <td>Agents</td>
                                    <td>{{ taskDetails.taskData.agents.join(',') }}</td>
                                  </tr>
                                </table>
                              </div> -->
                            </div>
                           <network ref="dag_net" :nodes="nodes" :edges="edges" :options="options" :events="['select']" >
                          </network>
                          </div>
                        </q-td>
                      </q-tr>
                    </template>
                  </q-table>
                </q-card-section>
              </q-card-section>
            <!-- </q-tab-panel> -->
          <!-- </q-tab-panels> -->
        </q-card>
      </div>
    </div>
    <div class="q-mt-lg row q-gutter-md justify-around">
      <div class="col-12">
        <q-card>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Network } from 'vue-vis-network'

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
    gridCols: {
      get () {
        for (let [key, value] of Object.entries(this.attckGrid)) {
          console.log(key, value)
        }
        return 1
      }
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
      attckColumns: [
        { name: '_id', label: '_id', field: '_id' },
        { name: 'techniques', label: 'techniques', field: 'techniques' }
      ],
      attckPagination: {
        rowsPerPage: 4,
        page: 1
      },
      attckGrid: {
        'initial-access': [],
        'execution': [],
        'persistence': [],
        'privilege-escalation': [],
        'defense-evasion': [],
        'credential-access': [],
        'discovery': [],
        'lateral-movement': [],
        'collection': [],
        'exfiltration': [],
        'command-and-control': [],
        'impact': []
      },
      attckData: [
        { _id: 'initial-access' },
        { _id: 'execution' },
        { _id: 'persistence' },
        { _id: 'privilege-escalation' },
        { _id: 'defense-evasion' },
        { _id: 'credential-access' },
        { _id: 'discovery' },
        { _id: 'lateral-movement' },
        { _id: 'collection' },
        { _id: 'exfiltration' },
        { _id: 'command-and-control' },
        { _id: 'impact' }
      ],
      campaignTab: 'scheduled',
      techniquesCount: 0,
      coverageCount: 0,
      validationsCount: 0,
      selectedCampaign: null,
      queryRating: 45,
      c2Rating: 35,
      cRating: 40,
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
      campaigns: [],
      platforms: [],
      columsCampaigns: [
        { name: 'name', align: 'left', label: 'Campaign', field: 'name', sortable: true },
        { name: 'saved_date', align: 'left', label: 'Issued on', field: 'saved_date', sortable: true },
        { name: 'group_id', align: 'right', label: 'Group ID', field: 'group_id' },
        { name: 'tasks', align: 'right', label: 'Task count', field: 'tasks', format: (val, row) => `${val.length}` }

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
    this.$getIntegrations()
    this.$getSearchIntegrations()
    this.getCampaigns()
  },
  methods: {
    sortTechniques (techniques) {
      function compareOrder (a, b) {
        const stageOrder = {
          'initial-access': 1,
          'execution': 2,
          'persistence': 3,
          'privilege-escalation': 4,
          'defense-evasion': 5,
          'credential-access': 6,
          'discovery': 7,
          'lateral-movement': 8,
          'collection': 9,
          'exfiltration': 10,
          'command-and-control': 11,
          'impact': 12
        }
        const orderA = stageOrder[a._id]
        const orderB = stageOrder[b._id]
        let comparison = 0

        if (orderA > orderB) {
          comparison = 1
        } else if (orderA < orderB) {
          comparison = -1
        }

        return comparison
      }
      return techniques.sort(compareOrder)
    },
    drawCampaign (groupId) {
      this.selectedCampaign = groupId
      this.getCampaign(groupId)
      this.getResults(groupId)
    },
    getCampaign (groupId) {
      this.$axios
        .get('/campaign/' + groupId)
        .then(response => this.getCampaignSuccess(response['data']))
    },
    getCampaignSuccess (response) {
      console.log(response)
      this.$store.commit('tasks/setNodes', [])
      this.$store.commit('tasks/setEdges', [])
      var stateMapping = {
        'Open': { 'color': '#ffffff', 'font': '#343a40' },
        'Processing': { 'color': '#343a40', 'font': '#ffffff' },
        'Processed': { 'color': '#343a40', 'font': '#ffffff' }
      }

      response.forEach(task => {
        this.$store.commit('tasks/addNode', {
          id: task.task,
          label: task.task,
          shape: 'box',
          color: stateMapping[task.state].color,
          font: {
            color: stateMapping[task.state].font,
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
      })
    },
    getResults (groupId) {
      this.$axios
        .get('/results', { params: { group_id: groupId } })
        .then(response => this.getResultsSuccess(response['data']))
    },
    getResultsSuccess (response) {
      response.forEach(element => {
        this.attckGrid[element.kill_chain_phase].push(element)
      })
    },
    getCampaigns () {
      this.$axios
        .get('/campaigns')
        .then(response => this.getCampaignsSuccess(response['data']))
    },
    getCampaignsSuccess (response) {
      console.log(response)
      this.campaigns = response
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

<style lang="scss" scoped>

.metric {
  height: 150px;
}

.tasks-table {
  height: 100%;
}

.fas {
  font-size: 20px !important;
}
</style>
