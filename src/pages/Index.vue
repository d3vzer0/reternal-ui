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
          <q-card-section horizontal>
            <q-card-section class="col-5">
              {{ campaigns }}
              <q-table
                flat
                title="Active campaigns"
                :data="campaigns"
                :columns="columsCampaigns"
                class="tasks-table">

                <template v-slot:header="props">
                  <q-tr :props="props">
                    <q-th auto-width />
                    <q-th v-for="col in props.cols" :key="col.name" :props="props">
                      {{ col.label }}
                    </q-th>
                  </q-tr>
                </template>

                <template v-slot:body="props">
                  <q-tr :props="props">
                  <q-td auto-width>
                    <q-btn size="sm" unelevated color="primary" round dense @click="props.expand = !props.expand" :icon="props.expand ? 'remove' : 'add'" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                  </q-td>
                  <q-td>
                    <q-icon size="sm" name="input" v-on:click="getCampaign(props.row._id)"></q-icon>
                  </q-td>
                </q-tr>
                <q-tr v-show="props.expand" :props="props">
                  <q-td colspan="100%">
                    <q-list separator>
                      <q-item class="text-left" v-for="(task, index) in props.row.tasks" v-bind:key="index">
                        <q-item-section avatar>
                          <q-icon name="update"></q-icon>
                        </q-item-section>
                        <q-item-section>
                          {{ task.task }}
                        </q-item-section>
                        <q-item-section side>
                          <q-item-label caption>Queued, scheduled for {{ task.scheduled_date}}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-td>
                </q-tr>
              </template>
              </q-table>
            </q-card-section>
            <q-card-section class="col-7">
              <div class="text-h5 q-mt-sm q-mb-xs">
                Execution Graph
              </div>
               <network :nodes="nodes" :edges="edges" :options="options" :events="['select']" >
              </network>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { Network } from 'vue2vis'
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
        { name: 'scheduled_date', align: 'left', label: 'Start (from) date', field: 'scheduled_date', sortable: true },
        { name: 'campaign', align: 'right', label: 'Campaign', field: 'campaign', sortable: true },
        { name: 'group_id', align: 'right', label: 'GUID', field: '_id' }
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
    },
    getCampaigns () {
      this.$axios
        .get('/campaigns')
        .then(response => this.getCampaignsSuccess(response['data']))
    },
    getCampaignsSuccess (response) {
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
</style>
