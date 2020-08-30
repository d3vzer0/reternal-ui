<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-mt-md row justify-around q-gutter-sm">
      <div class="col-xs-11 col-sm-5 col-md-5 col-lg-5 col-xl-5">
        <C2ModulesActive></C2ModulesActive>
      </div>
      <div class="col-xs-11 col-sm-5 col-md-5 col-lg-5 col-xl-5">
        <SearchModulesActive></SearchModulesActive>
      </div>
    </div>
    <div class="q-mt-md row justify-around q-gutter-sm">
      <!-- Filter column -->
      <div class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3">
        <q-card class="metric">
          <q-card-section horizontal>
            <q-card-section>
             <div class="text-h2 text-bold q-mt-sm q-mb-xs">
               {{ rulesCount }}
             </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Rules
              </div>
              <div class="text-caption text-grey">
                Amount of hunts or sigma rules available
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3">
        <q-card class="metric">
          <q-card-section horizontal>
            <q-card-section>
             <div class="text-h2 q-mt-sm q-mb-xs text-bold">
               {{ techniquesCount }}
             </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Techniques
              </div>
              <div class="text-caption text-grey">
                Amount of C2 commands mapped to ATTCK
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
       <div class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3">
        <q-card class="metric">
          <q-card-section horizontal>
            <q-card-section>
             <div class="text-h2 q-mt-sm q-mb-xs text-bold">
               {{ coverageCount }}
             </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Datasources
              </div>
              <div class="text-caption text-grey">
                 Number of datasources mapped to the DeTTECT framework
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="q-mt-lg row q-gutter-md justify-around">
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
                          <q-icon size="sm" name="fas fa-project-diagram" v-on:click="drawCampaign(props.row._id)"></q-icon>
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
                          <div class="dag" v-if="selectedCampaign && selectedCampaign._id === props.row._id">
                            <div class="dag-text" style="position: absolute; z-index: 100; padding: 20px;">
                              <div class="dag-text-content text-h7 q-mt-md" v-if="nodes.length > 0 && selectedNode">
                                <div class="row">
                                  <div class="cols-5">Name</div>
                                  <div class="cols q-ml-sm">{{ selectedNode.name }}<q-btn v-on:click="deleteTask()" dense unelevated icon="delete" size="sm"/></div>
                                </div>
                                <div class="row">
                                  <div class="cols-5">Time</div>
                                  <div class="cols q-ml-sm">{{ selectedNode.scheduled_date }}</div>
                                </div>
                                <div class="row">
                                  <div class="cols-5">Agent</div>
                                  <div class="cols q-ml-sm">{{ selectedNode.agent.name }}</div>
                                </div>
                              </div>
                            </div>
                            <network ref="dag_net" :nodes="nodes" :edges="edges" :options="options" :events="['select']"
                              @select='clickNode'>
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
import C2ModulesActive from 'components/C2Modules'
import SearchModulesActive from 'components/SearchModules'

export default {
  name: 'PageIndex',
  components: {
    C2ModulesActive,
    SearchModulesActive,
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
      techniquesCount: 0,
      coverageCount: 0,
      rulesCount: 0,
      selectedNode: null,
      selectedCampaign: null,
      tableSeperator: 'none',
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
        { name: 'nodes', align: 'right', label: 'Task count', field: 'nodes', format: (val, row) => `${val.length}` }

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
    this.getCountTechniques()
    this.getCountRules()
    this.getCountCoverage()
    this.getCampaigns()
  },
  methods: {
    drawCampaign (groupId) {
      this.getCampaign(groupId)
    },
    getCampaign (campaignId) {
      this.$axios
        .get('/campaign/' + campaignId)
        .then(response => this.getCampaignSuccess(response['data']))
    },
    getCampaignSuccess (response) {
      this.selectedCampaign = response
      this.$store.commit('tasks/setNodes', [])
      this.$store.commit('tasks/setEdges', [])
      var stateMapping = {
        'Scheduled': { 'color': '#ffffff', 'font': '#343a40' },
        'Processing': { 'color': '#343a40', 'font': '#ffffff' },
        'Processed': { 'color': '#343a40', 'font': '#ffffff' }
      }

      response.nodes.forEach(node => {
        this.$store.commit('tasks/addNode', {
          id: node.name,
          label: node.name,
          data: { 'no': 'yes' },
          shape: 'box',
          color: stateMapping[node.state].color,
          font: {
            color: stateMapping[node.state].font,
            size: 20
          },
          margin: 12
        })

        response.edges.forEach(edge => {
          this.$store.commit('tasks/addEdge', {
            from: edge.source,
            to: edge.destination,
            arrows: 'to',
            color: '#343a40',
            width: 3
          })
        })
      })
    },
    getCountTechniques () {
      this.$axios
        .get('/stats/count/techniques')
        .then(response => this.getCountTechniquesSuccess(response['data']))
    },
    getCountTechniquesSuccess (response) {
      this.techniquesCount = response.count
    },
    getCountRules () {
      this.$axios
        .get('/stats/count/rules')
        .then(response => this.getCountRulesSuccess(response['data']))
    },
    getCountRulesSuccess (response) {
      this.rulesCount = response.count
    },
    getCountCoverage () {
      this.$axios
        .get('/stats/count/coverage')
        .then(response => this.getCountCoverageSuccess(response['data']))
    },
    getCountCoverageSuccess (response) {
      this.coverageCount = response.count
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
    },
    clickNode (event) {
      if (event.nodes.length > 0) {
        console.log(this.selectedCampaign)
        let nodeData = this.selectedCampaign.nodes.filter(node => node.name.includes(event.nodes[0]))[0]
        this.selectedNode = nodeData
      }
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
