<template>
  <q-page>

    <q-dialog v-model="techniquePrompt">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h5">{{ techniqueDetails.name }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none q-gutter-sm">
          <q-badge v-for="platform in techniqueDetails.platforms" v-bind:key="platform" style="font-size:14px">
            <span v-if="platform === 'macOS'" class="q-pr-xs platformbadge"><q-icon class="q-ma-xs" name="fab fa-apple"  />macOS </span>
            <span v-else-if="platform === 'Linux'" class="q-pr-xs platformbadge"><q-icon class="q-ma-xs" name="fab fa-linux" /> Linux</span>
            <span v-else-if="platform === 'Windows'" class="q-pr-xs platformbadge"><q-icon class="q-ma-xs" name="fab fa-windows" /> Windows</span>
            <span v-else tyle="font-size:18px" class="q-pr-xs platformbadge"><q-icon class="q-ma-xs" name="fas fa-cloud" /> {{ platform }}</span>
          </q-badge>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-markdown>{{ techniqueDetails.description }}</q-markdown>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="text-h5">
            Datasources
          </div>
          <div class="q-pt-md">
            <span v-for="datasource in techniqueDetails.data_sources" v-bind:key="datasource">
              <q-chip class="datasourcehip" v-if="techniqueDetails.data_sources_available.includes(datasource)" icon="done">{{ datasource }}</q-chip>
              <q-chip class="datasourcehip" v-else icon="highlight_off">{{ datasource }}</q-chip>
            </span>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Center content row -->
    <div class="q-pa-md row">
      <div class="col-md-2 col-xl-2 col-sm-3 col-xs-4 filter-col">
        <!-- <div class="row">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-checkbox v-model="filterCoverage" label="Datasource available" />
              </q-card-section>

            </q-card>
          </div>
        </div> -->
        <div class="row justify-end">
          <div class="col">
            <axiosUploader flat
              class="uploaderCol"
              ref="coverageuploader"
              style="max-width: 100%"
              label="Upload CSV"
              accept=".csv, text/csv"
              :multiple="false"
              />
            <!-- <q-btn color="primary" round icon="add"/> -->
          </div>
        </div>

        <!-- Dynamic filters -->
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-select v-model="selectedPhase" :options="phaseOptions" label="Phase"/>
              </q-card-section>
              <q-card-section>
                <q-option-group :options="platformOptions" label="Platform" type="radio" v-model="selectedPlatform" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterActor">
                  <template v-slot:prepend>
                    <q-icon name="group" />
                  </template>
                </q-input>
                <q-scroll-area style="height: 450px;">
                  <q-option-group :options="actorOptions.filter(actor => actor.label.includes(filterActor))" label="Actors" type="radio" v-model="selectedActor" />
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col">
        <div class="row q-pa-md">
          <q-table
            grid
            :data="sortedTechniques"
            :columns="columns"
            row-key="_id"
            hide-header
            card-container-class="cardContainerClass"
            :pagination.sync="pagination">
            <template v-slot:item="props">
              <div class="q-pa-sm col-xl-3 col-xs-12 col-sm-6 col-md-4 col-lg-4">
                <q-card flat>
                  <q-card-section>
                    <q-btn unelevated
                      fab color="primary" :icon="phaseIcons[props.row._id]" class="absolute"
                      style="top: 0; right: 20px; transform: translateY(-30%);" @click="props.expand = !props.expand"
                    />
                    <div class="row no-wrap items-center">
                      <div class="col text-h6 ellipsis">
                        {{ props.row._id | capitalize}}
                      </div>
                    </div>
                  </q-card-section>
                  <!-- <q-seperator/> -->
                  <q-card-section>
                      <q-list>
                        <q-item>
                          <q-item-section avatar class="stats-number-card">
                            {{ props.row.techniques.length }}
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Techniques</q-item-label>
                            <q-item-label caption>Total number of techniques in phase</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item>
                          <q-item-section avatar class="stats-number-card no-coverage" v-if="coverageCount(props.row) === 0">
                            {{ coverageCount(props.row) }}
                          </q-item-section>
                          <q-item-section avatar class="stats-number-card has-coverage" v-else>
                            {{ coverageCount(props.row) }}
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Coverage</q-item-label>
                            <q-item-label caption>Total techniques with at least 1 datasource available</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                  </q-card-section>
                  <q-separator />
                   <!-- v-if="props.expand"  -->
                  <q-card-section>
                    <q-list separator>
                      <q-scroll-area style="height: 600px;">
                        <q-item v-for="(technique, index) in props.row.techniques" v-bind:key="index">
                          <q-item-section>
                            <q-item-label>
                              {{ technique.name }}
                            </q-item-label>
                            <q-item-label lines="1">
                              <q-linear-progress size="25px" :value="technique.data_sources_available.length / technique.data_sources.length">
                                <div class="absolute-full flex flex-center">
                                  <q-badge class="badgestatus">{{ technique.data_sources_available.length }} / {{ technique.data_sources.length }}</q-badge>
                                </div>
                              </q-linear-progress>
                            </q-item-label>
                          </q-item-section>
                          <q-item-section avatar>
                            <q-btn icon="help_outline" flat color="primary" @click="getTechniqueDetails(technique.technique_id)" />
                          </q-item-section>
                        </q-item>
                      </q-scroll-area>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </div>
      <!-- /Results column -->
    </div>
  </q-page>
</template>

<script>
import axiosUploader from 'components/axiosUploader'

export default {
  name: 'Mitre',
  components: {
    axiosUploader
  },
  data () {
    return {
      uploadDialog: false,
      uploadHelp: {
        splunk: '| tstats values(sourcetype) AS sourcetype where index=* group by index, source| mvexpand sourcetype'
      },
      pagination: {
        page: 1,
        rowsPerPage: 4
      },
      columns: [
        { name: '_id', label: '_id', field: '_id' },
        { name: 'techniques', label: 'techniques', field: 'techniques' }
      ],
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      selectedPlatform: 'Windows',
      phaseIcons: {
        'initial-access': 'mdi-clock-start',
        'execution': 'mdi-play-circle',
        'persistence': 'mdi-backup-restore',
        'privilege-escalation': 'mdi-account-plus',
        'defense-evasion': 'mdi-shield-remove',
        'credential-access': 'mdi-lock-question',
        'discovery': 'mdi-folder-search',
        'lateral-movement': 'mdi-lan-pending',
        'exfiltration': 'mdi-file-upload',
        'collection': 'mdi-content-save-all',
        'command-and-control': 'mdi-swap-vertical-bold',
        'impact': 'mdi-bomb'
      },
      phaseOptions: [
        '', 'initial-access', 'execution', 'persistence', 'privilege-escalation',
        'defense-evasion', 'credential-access', 'discovery', 'lateral-movement',
        'exfiltration', 'collection', 'command-and-control', 'impact'
      ],
      selectedPhase: '',
      actorOptions: [
        { value: '', label: 'Any' }
      ],
      filterActor: '',
      filterCoverage: false,
      selectedActor: '',
      searchTechnique: '',
      sortedTechniques: [],
      techniqueDetails: { },
      techniquePrompt: false
    }
  },
  computed: {
  },
  filters: {
    capitalize: function (value) {
      if (!value) return ''
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  created () {
    this.getActors()
    this.getTechniques()
  },
  watch: {
    selectedActor: function (actor) {
      this.getTechniques()
    },
    selectedPlatform: function (platform) {
      this.getTechniques()
    },
    selectedPhase: function (phase) {
      this.getTechniques()
    }
  },
  methods: {
    infiteTechniques (shownCount, techniques) {
      console.log(shownCount, techniques)
      return ''
    },
    coverageCount (phase) {
      return phase.techniques.filter(technique => technique.data_sources_available.length).length
    },
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
    getTechniqueDetails (technique) {
      this.$axios
        .get('/mitre/technique/' + technique)
        .then(response => this.getTechniqueDetailsSuccess(response['data']))
    },
    getTechniqueDetailsSuccess (details) {
      this.techniqueDetails = details
      this.techniquePrompt = true
    },
    getActorDetailsSuccess (details) {
      this.actorDetails = details
    },
    getActors () {
      this.$axios
        .get('/mitre/actors')
        .then(response => this.getActorsSuccess(response['data']))
    },
    getActorsSuccess (actors) {
      actors.forEach(actor => {
        this.actorOptions.push({ 'value': actor, 'label': actor })
      })
    },
    getTechniques () {
      this.$axios
        .get('mitre/aggregate/by_phase', {
          params: {
            actor: this.selectedActor,
            name: this.searchTechnique,
            phase: this.selectedPhase,
            platform: this.selectedPlatform
          }
        })
        .then(response => this.getTechniquesSuccess(response['data']))
    },
    getTechniquesSuccess (techniques) {
      this.sortedTechniques = this.sortTechniques(techniques)
    }
  }
}
</script>

<style lang="scss">
.stats-number-card {
  font-size: 30px;
}

.no-coverage {
  color: red;
}

.has-coverage {
  color: green;
}

.filter-col {
  max-width: 250px !important;
}

.body--light {
  .badgestatus {
    background-color: white;
    color: $primary;
  }
  .q-uploader__header {
    background-color: $primary;
    color: white;
  }
}

.body--dark {
  .badgestatus {
    background-color: $primary;
    color: #f5f5f5;
  }
  .q-uploader__header {
    color: $primary;
  }
  .datasourcehip {
    background-color: #f5f5f5;
    color: $primary;
  }
  .platformbadge {
    color: $primary;
  }
}

</style>
