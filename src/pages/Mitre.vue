<template>
  <q-page>
    <q-dialog v-model="techniquePrompt" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card style="width: 700px; max-width: 80vw">
        <q-card-section>
          <div class="text-h5">{{ techniqueDetails.name }}</div>
        </q-card-section>
        <q-card-section class="q-pt-none q-gutter-sm">
          <q-badge color="primary" v-for="platform in techniqueDetails.platforms" v-bind:key="platform" style="font-size:14px">
            <span v-if="platform === 'macOS'" class="q-pr-xs"><q-icon class="q-ma-xs" name="fab fa-apple" color="white" />macOS </span>
            <span v-else-if="platform === 'Linux'" class="q-pr-xs"><q-icon class="q-ma-xs" name="fab fa-linux" color="white" /> Linux</span>
            <span v-else-if="platform === 'Windows'" class="q-pr-xs"><q-icon class="q-ma-xs" name="fab fa-windows" color="white" /> Windows</span>
            <span v-else tyle="font-size:18px" class="q-pr-xs"><q-icon class="q-ma-xs" name="fas fa-cloud" color="white"/> {{ platform }}</span>
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
              <q-chip v-if="techniqueDetails.data_sources_available.includes(datasource)" icon="done">{{ datasource }}</q-chip>
              <q-chip v-else icon="highlight_off">{{ datasource }}</q-chip>
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
      <!-- Filter column -->
      <div class="col-2">
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-checkbox v-model="filterCoverage" label="Datasource available" />
              </q-card-section>

            </q-card>
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
        <div class="row">
          <div class="col q-pa-md">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :input="true">
            </q-pagination>
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pa-md" v-for="(phase, index) in techniquesFiltered" v-bind:key="index">
            <q-card flat class="my-card">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ phase.name | capitalize }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-list separator>
                  <q-scroll-area style="height: 1200px;">
                    <q-item v-for="(technique, index) in phase.techniques" v-bind:key="index">
                      <q-item-section>
                        <q-item-label>
                          {{ technique.name }}
                        </q-item-label>
                        <q-item-label>
                          <q-rating readonly
                            v-model="technique.data_sources_available.length"
                            :max="technique.data_sources.length"
                            color="primary"
                          />
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
        </div>
      </div>
      <!-- /Results column -->

    </div>
    <!-- /Center content row -->
  </q-page>
</template>

<script>

export default {
  name: 'Mitre',
  data () {
    return {
      currentPage: 1,
      totalPages: 4,
      maxPhases: 3,
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      selectedPlatform: 'Windows',
      aggregatedTechniques: {
        'initial-access': {
          'stage': 1,
          'techniques': []
        },
        'execution': {
          'stage': 2,
          'techniques': []
        },
        'persistence': {
          'stage': 3,
          'techniques': []
        },
        'privilege-escalation': {
          'stage': 4,
          'techniques': []
        },
        'defense-evasion': {
          'stage': 5,
          'techniques': []
        },
        'credential-access': {
          'stage': 6,
          'techniques': []
        },
        'discovery': {
          'stage': 7,
          'techniques': []
        },
        'lateral-movement': {
          'stage': 8,
          'techniques': []
        },
        'collection': {
          'stage': 9,
          'techniques': []
        },
        'exfiltration': {
          'stage': 10,
          'techniques': []
        },
        'command-and-control': {
          'stage': 11,
          'techniques': []
        },
        'impact': {
          'stage': 12,
          'techniques': []
        }
      },
      phaseOptions: [
        '', 'initial-access', 'execution', 'persistence', 'privilege-escalation',
        'defense-evasion', 'credential-access', 'discovery', 'lateral-movement',
        'exfiltration', 'collection', 'command-and-control'
      ],
      selectedPhase: '',
      actorOptions: [
        { value: '', label: 'Any' }
      ],
      filterActor: '',
      filterCoverage: false,
      selectedActor: '',
      searchTechnique: '',
      techniqueOptions: [],
      techniqueDetails: { },
      techniquePrompt: false
    }
  },
  computed: {
    techniquesFiltered: {
      get () {
        var filteredTechniques = []
        for (const [key, value] of Object.entries(this.aggregatedTechniques)) {
          if (Math.ceil(value.stage / this.maxPhases) === this.currentPage) {
            filteredTechniques.push({ 'name': key, 'techniques': value.techniques })
          }
        }
        return filteredTechniques
      }
    }
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
      this.techniqueOptions = techniques
      techniques.forEach(technique => {
        this.aggregatedTechniques[technique._id]['techniques'] = technique['techniques']
      })
    },
    getRating (technique) {
      console.log(technique)
    }
  }
}
</script>
