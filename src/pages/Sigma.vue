<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-2">
        <!-- Dynamic filters -->
        <div class="row">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterLevel" label="Level">
                  <template v-slot:prepend>
                    <q-icon name="find_in_page" />
                  </template>
                </q-input>
                <q-option-group :options="levelOptions.filter(lo => lo.label.includes(filterLevel))" label="Level" type="radio" v-model="filters.level" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterStatus" label="Status">
                  <template v-slot:prepend>
                    <q-icon name="find_in_page" />
                  </template>
                </q-input>
                <q-option-group :options="statusOptions.filter(so => so.label.includes(filterStatus))" label="Status" type="radio" v-model="filters.status" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterDatasource" label="Datasource">
                  <template v-slot:prepend>
                    <q-icon name="find_in_page" />
                  </template>
                </q-input>
                <q-scroll-area style="height: 250px;">
                  <q-option-group :options="datasourceOptions.filter(ds => ds.label.includes(filterDatasource))" label="Datasource" type="radio" v-model="filters.datasource" />
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterL1Usecase" label="L1 Usecase">
                  <template v-slot:prepend>
                    <q-icon name="mdi-bullseye" />
                  </template>
                </q-input>
                <q-scroll-area style="height: 250px;">
                  <q-option-group :options="l1UseCaseOptions.filter(uc => uc.label.includes(filterL1Usecase))" label="L1 Usecase" type="radio" v-model="filters.l1Usecase" />
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterL2Usecase" label="L2 Usecase">
                  <template v-slot:prepend>
                    <q-icon name="mdi-bullseye" />
                  </template>
                </q-input>
                <q-scroll-area style="height: 250px;">
                  <q-option-group :options="l2UseCaseOptions.filter(uc => uc.label.includes(filterL2Usecase))" label="L2 Usecase" type="radio" v-model="filters.l2Usecase" />
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterTechnique" label="Technique">
                  <template v-slot:prepend>
                    <q-icon name="mdi-bullseye" />
                  </template>
                </q-input>
                <q-scroll-area style="height: 550px;">
                  <q-option-group :options="techniqueOptions.filter(technique => technique.label.includes(filterTechnique))" label="Techniques" type="radio" v-model="filters.technique" />
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div> -->
        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col q-pl-md">
        <div class="row">
          <div class="col">
            <q-card flat v-if="phaseOptions.length === 0">
              <q-card-section>
                <div class="text-h6">
                  <span>No hunts found</span>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat v-else>
              <q-tabs v-model="tab">
                <q-tab v-for="(phase, index) in phaseOptions" v-bind:key="index"
                  :name="phase" inline-label :label="phase">
                </q-tab>
              </q-tabs>
              <q-stepper v-model="phaseStep" animated vertical header-nav ref="stepper">
                <q-step v-for="(rule, index) in phaseSigma[tab]" v-bind:key="index"
                  :name="rule.hash" :title="`${rule.title} (${rule.technique.name} / ${rule.technique.references[0].external_id})`" icon="details">
                  <!-- <div class="row">
                    <div class="col-2">
                      <b>Sigma ID</b>
                    </div>
                    <div class="col">
                      {{ rule.sigma_id }}
                    </div>
                  </div> -->
                  <div class="row">
                    <div class="col-2">
                      <b>Author</b>
                    </div>
                    <div class="col">
                      {{ rule.author }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>Description</b>
                    </div>
                    <div class="col">
                      {{ rule.description }}
                    </div>
                  </div>
                  <div class="row" v-if="rule.status">
                    <div class="col-2">
                      <b>Status</b>
                    </div>
                    <div class="col">
                      {{ rule.status }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>Level</b>
                    </div>
                    <div class="col">
                      {{ rule.level }}
                    </div>
                  </div>
                  <div class="row" v-if="rule.references">
                    <div class="col-2">
                      <b>Reference</b>
                    </div>
                    <div class="col">
                      {{ rule.references.join(', ') }}
                    </div>
                  </div>

                  <!-- <div class="row">
                    <div class="col-2">
                      <b>Technique</b>
                    </div>
                    <div class="col">
                      {{ rule.technique.name }}
                    </div>
                  </div> -->
                  <div class="row" v-if="rule.technique.magma">
                    <div class="col-2">
                      <b>Usecase</b>
                    </div>
                    <div class="col">
                      {{ rule.technique.magma.l1_usecase_name }} / {{ rule.technique.magma.l2_usecase_name }}
                    </div>
                  </div>
                  <!-- <div class="row">
                    <div class="col-2">
                      <b>External. ID</b>
                    </div>
                    <div class="col">
                      {{ rule.technique.references[0].external_id }}
                    </div>
                  </div> -->
                  <div class="row q-mt-md">
                    <div class="col">
                      <div>
                        <vue-code-highlight class="language-bash">{{JSON.stringify(rule.detection)}}</vue-code-highlight>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-md">
                    <div class="col">
                      <div>
                        <vue-code-highlight class="language-bash">{{JSON.stringify(rule.logsource)}}</vue-code-highlight>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-md">
                    <div class="col">
                      <span v-for="datasource in rule.technique.data_sources" v-bind:key="datasource">
                        <q-chip clickable v-if="rule.technique.data_sources_available.includes(datasource)"
                          color="teal" text-color="white" icon="done" @click="$router.push({ path: '/coverage', query: { datasource: datasource } })">{{ datasource }}</q-chip>
                        <q-chip clickable v-else icon="highlight_off" @click="$router.push({ path: '/coverage', query: { datasource: datasource } })">{{ datasource }}</q-chip>
                      </span>
                    </div>
                  </div>
                </q-step>
              </q-stepper>
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
import { component as VueCodeHighlight } from 'vue-code-highlight'
import 'vue-code-highlight/themes/prism-okaidia.css'

export default {
  name: 'Sigma',
  components: {
    VueCodeHighlight
  },
  data () {
    return {
      tab: null,
      phaseStep: '',
      filters: {
        datasource: '',
        l1Usecase: '',
        l2Usecase: '',
        technique: '',
        level: '',
        status: ''
      },
      integrationOptions: [],
      levelOptions: [
        { value: '', label: 'Any' },
        { value: 'low', label: 'low' },
        { value: 'medium', label: 'medium' },
        { value: 'high', label: 'high' },
        { value: 'critical', label: 'critical' }
      ],
      statusOptions: [
        { value: '', label: 'Any' },
        { value: 'stable', label: 'stable' },
        { value: 'testing', label: 'testing' },
        { value: 'experimental', label: 'experimental' }
      ],
      techniqueOptions: [
        { value: '', label: 'Any' }
      ],
      phaseOptions: [],
      datasourceOptions: [
        { value: '', label: 'Any' }
      ],
      l1UseCaseOptions: [
        { value: '', label: 'Any' }
      ],
      l2UseCaseOptions: [
        { value: '', label: 'Any' }
      ],
      filterLevel: '',
      filterStatus: '',
      filterTechnique: '',
      filterL1Usecase: '',
      filterL2Usecase: '',
      filterDatasource: '',
      phaseSigma: {
      },
      phase: '',
      actors: [
        { 'value': '', 'label': 'Any' }
      ]
    }
  },
  computed: {
    searchFilters () {
      return {
        integration: this.filters.integration,
        technique: this.filters.technique,
        l1usecase: this.filters.l1Usecase,
        l2usecase: this.filters.l2Usecase,
        datasource: this.filters.datasource,
        status: this.filters.status,
        level: this.filters.level
      }
    }
  },
  created () {
    this.refreshFilters()
  },
  watch: {
    filters: {
      handler (value) {
        if (JSON.stringify(this.$route.query) !== JSON.stringify(this.searchFilters)) {
          this.$router.replace({ path: '/sigma', query: this.searchFilters })
        }
        this.refreshFilters()
      },
      deep: true
    },
    tab: function (tab) {
      if (typeof tab !== 'undefined') {
        this.getSigma()
      }
    }
  },
  methods: {
    refreshFilters () {
      if (this.$route.query) {
        for (let [key, value] of Object.entries(this.$route.query)) {
          this.filters[key] = value
        }
      }
      this.phaseSigma = {}
      this.phaseOptions = []
      this.getDatasources()
      this.getTechniques()
      this.getL1Usecases()
      this.getL2Usecases()
      this.getPhases()
      this.tab = this.phaseOptions[0]
    },
    getDatasources () {
      this.$axios
        .get('/sigma/datasources', {
          params: this.searchFilters
        })
        .then(response => this.getDatasourcesSuccess(response['data']))
    },
    getDatasourcesSuccess (datasources) {
      this.datasourceOptions = [{ value: '', label: 'Any' }]
      datasources.forEach(ds => {
        this.datasourceOptions.push({ 'value': ds, 'label': ds })
      })
    },
    getL1Usecases () {
      this.$axios
        .get('/sigma/l1usecases', {
          params: this.searchFilters
        })
        .then(response => this.getL1UsecasesSuccess(response['data']))
    },
    getL1UsecasesSuccess (usecases) {
      this.l1UseCaseOptions = [{ value: '', label: 'Any' }]
      usecases.forEach(uc => {
        this.l1UseCaseOptions.push({ 'value': uc, 'label': uc })
      })
    },
    getL2Usecases () {
      this.$axios
        .get('/sigma/l2usecases', {
          params: this.searchFilters
        })
        .then(response => this.getL2UsecasesSuccess(response['data']))
    },
    getL2UsecasesSuccess (usecases) {
      this.l2UseCaseOptions = [{ value: '', label: 'Any' }]
      usecases.forEach(uc => {
        this.l2UseCaseOptions.push({ 'value': uc, 'label': uc })
      })
    },
    getTechniques () {
      this.$axios
        .get('/sigma/techniques', {
          params: this.searchFilters
        })
        .then(response => this.getTechniquesSuccess(response['data']))
    },
    getTechniquesSuccess (techniuqes) {
      this.techniqueOptions = [{ value: '', label: 'Any' }]
      techniuqes.forEach(technique => {
        this.techniqueOptions.push({ 'value': technique, 'label': technique })
      })
    },
    getPhases () {
      this.$axios
        .get('/sigma/phases', {
          params: this.searchFilters
        })
        .then(response => this.getPhasesSuccess(response['data']))
    },
    getPhasesSuccess (phases) {
      this.phaseOptions = phases
      this.tab = ''
      this.tab = this.phaseOptions[0]
    },
    getSigma () {
      this.$axios
        .get('/sigma', {
          params: {
            integration: this.filters.integration,
            technique: this.filters.technique,
            l1usecase: this.filters.l1Usecase,
            l2usecase: this.filters.l2Usecase,
            datasource: this.filters.datasource,
            level: this.filters.level,
            status: this.filters.status,
            phase: this.tab
          }
        })
        .then(response => this.getSigmaSuccess(response['data']))
    },
    getSigmaSuccess (rules) {
      this.phaseSigma = {
        'initial-access': { },
        'execution': { },
        'persistence': { },
        'privilege-escalation': { },
        'defense-evasion': { },
        'credential-access': { },
        'discovery': { },
        'lateral-movement': { },
        'collection': { },
        'exfiltration': { },
        'command-and-control': { }
      }
      rules.forEach(rule => {
        rule.techniques.forEach(technique => {
          technique.kill_chain_phases.forEach(phase => {
            var phaseRule = rule
            phaseRule['technique'] = technique
            this.phaseSigma[phase][rule['_id']] = phaseRule
          })
        })
      })
    },
    addToQueue (technique) {
    }
  }
}
</script>
