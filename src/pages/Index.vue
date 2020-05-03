<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-mt-md row justify-around q-gutter-md">
      <!-- Filter column -->
      <div class="col-xs-11 col-sm-6 col-md-6 col-lg-3 col-xl-3 " style="height: 200px;">
        <q-card style="height: 200px;">
          <q-card-section horizontal>
            <q-card-section>
              <q-knob
                readonly
                v-model="dsRating"
                show-value
                size="120px"
                :thickness="0.22"
                track-color="grey-3"
                class="text-primary q-ma-md"
              />
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Datasources
              </div>
              <div class="text-caption text-grey">
                Amount of datasources mapped to the DeTTECT framework
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-11 col-sm-6 col-md-6 col-lg-3 col-xl-3">
        <ModulesActive></ModulesActive>
      </div>

       <div class="col-xs-11 col-sm-6 col-md-5 col-lg-3 col-xl-3">
        <q-card style="height: 200px;">
          <q-card-section horizontal>
            <q-card-section>
              <q-knob
                readonly
                v-model="cRating"
                show-value
                size="120px"
                :thickness="0.22"
                color="primary"
                track-color="grey-3"
                class="text-primary q-ma-md"
              />
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Coverage
              </div>
              <div class="text-caption text-grey">
                Percentage of ATT&CK techniques covered based on the DeTTECT coverage mapping
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="q-mt-lg row q-gutter-md justify-around ">
      <div class="col-11">
        <q-card>
          <q-tabs v-model="campaignTab" active-color="primary" indicator-color="primary" align="justify" class="text-grey">
            <q-tab name="scheduled" label="Scheduled"/>
            <q-tab name="processing" label="Processing" />
            <q-tab name="completed" label="Completed" />
          </q-tabs>
          <q-tab-panels v-model="campaignTab" animated>
            <q-tab-panel name="scheduled">
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
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Network } from 'vue-vis-network'
import ModulesActive from 'components/Modules'

export default {
  name: 'PageIndex',
  components: {
    ModulesActive,
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
      campaignTab: 'scheduled',
      selectedCampaign: null,
      dsRating: 25,
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
    this.getCampaigns()
  },
  methods: {
    drawCampaign (groupId) {
      this.selectedCampaign = groupId
      this.getCampaign(groupId)
    },
    getCampaign (groupId) {
      this.$axios
        .get('/campaign/' + groupId)
        .then(response => this.getCampaignSuccess(response['data']))
    },
    getCampaignSuccess (response) {
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
      this.$refs.dag_net.fit()
      this.$refs.dag_net.redraw()
      this.$refs.dag_net.fit()
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
.tasks-table {
  height: 100%;
}

.fas {
  font-size: 20px !important;
}
</style>
