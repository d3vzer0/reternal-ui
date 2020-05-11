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
                <q-option-group :options="integrationOptions" label="Platform" type="radio" v-model="selectedIntegration" />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterL1Usecase" label="L1 Usecase">
                  <template v-slot:prepend>
                    <q-icon name="mdi-bullseye" />
                  </template>
                </q-input>
                <q-scroll-area style="height: 250px;">
                  <q-option-group :options="l1UseCaseOptions.filter(uc => uc.label.includes(filterL1Usecase))" label="L1 Usecase" type="radio" v-model="selectedL1Usecase" />
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
                  <q-option-group :options="l2UseCaseOptions.filter(uc => uc.label.includes(filterL2Usecase))" label="L2 Usecase" type="radio" v-model="selectedL2Usecase" />
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div> -->
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterTechnique" label="Technique">
                  <template v-slot:prepend>
                    <q-icon name="mdi-bullseye" />
                  </template>
                </q-input>
                <q-scroll-area style="height: 550px;">
                  <q-option-group :options="techniqueOptions.filter(technique => technique.label.includes(filterTechnique))" label="Techniques" type="radio" v-model="selectedTechnique" />
                </q-scroll-area>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col q-pl-md">
        <div class="row">
          <div class="col">
            <q-card flat>
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
                  <div class="row">
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
                      <!-- <q-timeline>
                        <q-timeline-entry v-for="(query, index) in validator.queries" v-bind:key="index">
                          <template v-slot:subtitle>
                          </template> -->
                          <div>
                            <vue-code-highlight class="language-bash">{{validator.search}}</vue-code-highlight>
                          </div>
                        <!-- </q-timeline-entry>
                      </q-timeline> -->
                    </div>
                  </div>
                  <div class="row q-mt-md">
                    <div class="col">
                      <span v-for="datasource in validator.data_sources" v-bind:key="datasource">
                        <q-chip v-if="validator.data_sources_available.includes(datasource)" icon="done">{{ datasource }}</q-chip>
                        <q-chip v-else icon="highlight_off">{{ datasource }}</q-chip>
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
      selectedIntegration: 'Splunk',
      integrationOptions: [],
      techniqueOptions: [
        { value: '', label: 'Any' }
      ],
      phaseOptions: [],
      l1UseCaseOptions: [
        { value: '', label: 'Any' }
      ],
      l2UseCaseOptions: [
        { value: '', label: 'Any' }
      ],
      filterTechnique: '',
      filterL1Usecase: '',
      filterL2Usecase: '',
      phaseValidations: {
      },
      selectedPhase: '',
      selectedL1Usecase: '',
      selectedL2Usecase: '',
      selectedTechnique: '',
      actors: [
        { 'value': '', 'label': 'Any' }
      ],
      actorDetails: {},
      selectedActor: '',
      filterActor: ''
    }
  },
  created () {
    this.getIntegrations()
    this.getPhases()
    this.getTechniques()
    this.getL1Usecases()
    this.getL2Usecases()
  },
  watch: {
    selectedTechnique: function (technique) {
      this.phaseValidations = {}
      this.phaseOptions = []
      this.getPhases()
    },
    selectedIntegration: function (platform) {
      this.phaseValidations = {}
      this.getPhases()
    },
    tab: function (tab) {
      this.getValidations()
    }
  },
  methods: {
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
    getActorDetails (actor) {
      this.$axios
        .get('/mitre/actor/' + actor)
        .then(response => this.getActorDetailsSuccess(response['data']))
    },
    getActorDetailsSuccess (details) {
      this.actorDetails = details
    },
    getL1Usecases () {
      this.$axios
        .get('/validations/l1usecases', {
          params: {
            integration: this.selectedIntegration
          }
        })
        .then(response => this.getL1UsecasesSuccess(response['data']))
    },
    getL1UsecasesSuccess (usecases) {
      usecases.forEach(uc => {
        this.l1UseCaseOptions.push({ 'value': uc, 'label': uc })
      })
    },
    getL2Usecases () {
      this.$axios
        .get('/validations/l2usecases', {
          params: {
            integration: this.selectedIntegration
          }
        })
        .then(response => this.getL2UsecasesSuccess(response['data']))
    },
    getL2UsecasesSuccess (usecases) {
      usecases.forEach(uc => {
        this.l2UseCaseOptions.push({ 'value': uc, 'label': uc })
      })
    },
    getTechniques () {
      this.$axios
        .get('/validations/techniques', {
          params: {
            integration: this.selectedIntegration
          }
        })
        .then(response => this.getTechniquesSuccess(response['data']))
    },
    getTechniquesSuccess (techniuqes) {
      techniuqes.forEach(technique => {
        this.techniqueOptions.push({ 'value': technique, 'label': technique })
      })
    },
    getPhases () {
      this.$axios
        .get('/validations/phases', {
          params: {
            integration: this.selectedIntegration,
            technique: this.selectedTechnique
          }
        })
        .then(response => this.getPhasesSuccess(response['data']))
    },
    getPhasesSuccess (phases) {
      this.tab = ''
      this.phaseOptions = phases
      this.tab = this.phaseOptions[0]
    },
    getValidations () {
      this.$axios
        .get('/validations', {
          params: {
            integration: this.selectedIntegration,
            technique: this.selectedTechnique,
            l1usecase: this.selectedL1Usecase,
            l2usecase: this.selectedL2Usecase,
            phase: this.tab
          }
        })
        .then(response => this.getValidationsSuccess(response['data']))
    },
    getValidationsSuccess (validators) {
      console.log(validators)
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
