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
                <q-option-group :options="integrationOptions" label="Platform" type="radio" v-model="filters.integration" />
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
                <q-step v-for="(validator, index) in phaseValidations[tab]" v-bind:key="index"
                  :name="validator.name" :title="`${validator.name} (${validator.technique_name})`" icon="details">
                  <!-- <div class="row">
                    <div class="col-2">
                      <b>Name</b>
                    </div>
                    <div class="col">
                      {{ validator.name }}
                    </div>
                  </div> -->
                  <div class="row">
                    <div class="col-2">
                      <b>Author</b>
                    </div>
                    <div class="col">
                      {{ validator.author }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>Reference</b>
                    </div>
                    <div class="col">
                      {{ validator.reference }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>Description</b>
                    </div>
                    <div class="col">
                      {{ validator.description }}
                    </div>
                  </div>
                  <div class="row" v-if="validator.magma">
                    <div class="col-2">
                      <b>Usecase</b>
                    </div>
                    <div class="col">
                      {{ validator.magma.l1_usecase_name }} / {{ validator.magma.l2_usecase_name }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>External. ID</b>
                    </div>
                    <div class="col">
                      {{ validator.external_id }}
                    </div>
                  </div>
                  <div class="row q-mt-md">
                    <div class="col">
                      <div>
                        <vue-code-highlight class="language-bash">{{validator.search}}</vue-code-highlight>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-md">
                    <div class="col">
                      <span v-for="datasource in validator.data_sources" v-bind:key="datasource">
                        <q-chip clickable v-if="validator.data_sources_available.includes(datasource)"
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
  name: 'Validations',
  components: {
    VueCodeHighlight
  },
  data () {
    return {
      tab: null,
      phaseStep: '',
      filters: {
        integration: 'Splunk',
        datasource: '',
        l1Usecase: '',
        l2Usecase: '',
        technique: ''
      },
      integrationOptions: [],
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
      filterTechnique: '',
      filterL1Usecase: '',
      filterL2Usecase: '',
      filterDatasource: '',
      phaseValidations: {
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
        datasource: this.filters.datasource
      }
    }
  },
  created () {
    this.getIntegrations()
    this.refreshFilters()
  },
  watch: {
    filters: {
      handler (value) {
        if (JSON.stringify(this.$route.query) !== JSON.stringify(this.searchFilters)) {
          this.$router.replace({ path: '/validations', query: this.searchFilters })
        }
        this.refreshFilters()
      },
      deep: true
    },
    tab: function (tab) {
      this.getValidations()
    }
  },
  methods: {
    refreshFilters () {
      if (this.$route.query) {
        for (let [key, value] of Object.entries(this.$route.query)) {
          this.filters[key] = value
        }
      }
      this.phaseValidations = {}
      this.phaseOptions = []
      this.getDatasources()
      this.getTechniques()
      this.getL1Usecases()
      this.getL2Usecases()
      this.getPhases()
      this.tab = this.phaseOptions[0]
    },
    getIntegrations () {
      this.$axios
        .get('/validations/integrations')
        .then(response => this.getIntegrationsSuccess(response['data']))
    },
    getIntegrationsSuccess (validations) {
      validations.forEach(val => {
        this.integrationOptions.push({ 'value': val, 'label': val })
      })
    },
    getDatasources () {
      this.$axios
        .get('/validations/datasources', {
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
        .get('/validations/l1usecases', {
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
        .get('/validations/l2usecases', {
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
        .get('/validations/techniques', {
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
        .get('/validations/phases', {
          params: this.searchFilters
        })
        .then(response => this.getPhasesSuccess(response['data']))
    },
    getPhasesSuccess (phases) {
      this.phaseOptions = phases
      this.tab = ''
      this.tab = this.phaseOptions[0]
    },
    getValidations () {
      this.$axios
        .get('/validations', {
          params: {
            integration: this.filters.integration,
            technique: this.filters.technique,
            l1usecase: this.filters.l1Usecase,
            l2usecase: this.filters.l2Usecase,
            datasource: this.filters.datasource,
            phase: this.tab
          }
        })
        .then(response => this.getValidationsSuccess(response['data']))
    },
    getValidationsSuccess (validators) {
      this.phaseValidations = {
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
        'command-and-control': []
      }
      validators.forEach(validator => {
        validator.kill_chain_phases.forEach(phase => {
          this.phaseValidations[phase].push(validator)
        })
      })
    },
    addToQueue (technique) {
    }
  }
}
</script>
