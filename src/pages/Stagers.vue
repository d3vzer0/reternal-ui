<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <div class="col-3">
        <!-- Dynamic filters -->
         <div class="row">
          <div class="col">
            <C2ModulesActive></C2ModulesActive>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-option-group :options="integrationOptions" label="Platform" type="radio" v-model="selectedIntegration" />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-option-group :options="platformOptions" label="Platform" type="radio" v-model="selectedPlatform" :disable="selectedIntegration === null"/>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- /Dynamic filters-->
      </div>
      <!-- Results column -->
      <div class="col">
        <div class="row">
          <div class="col-12 q-pl-md">
            <q-card flat>
              <q-card-section>
                <q-stepper v-model="step" ref="stepper" color="primary" animated flat>
                  <q-step :name="1" title="Select stager" icon="settings" :done="step > 1" :disable="selectedIntegration === null">
                    <q-list v-if="selectedPlatform">
                      <q-item tag="label" v-ripple v-for="(options, stager) in integrationStagers[selectedPlatform]" v-bind:key="stager">
                        <q-item-section avatar>
                          <q-radio v-model="selectedStager" :val="stager" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ stager }}</q-item-label>
                          <q-item-label caption>
                            {{ options.description}}
                          </q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-step>
                  <q-step :name="2" title="Set stager options" icon="settings" :done="step > 2">
                    <q-form class="q-gutter-sm" v-if="selectedStager">
                      <q-input v-for="(settings, stager) in integrationStagers[selectedPlatform][selectedStager]['options']" v-bind:key="stager"
                        :label="stager"
                        v-model="settings.default"
                        :hint="settings.description"
                        :error="isRequired(settings.default, settings)"
                        filled
                      />
                    </q-form>
                  </q-step>
                  <q-step :name="3" title="Building stager" icon="settings" :done="step > 3">
                    <q-card flat>
                      <q-card-section>
                        <div class="text-h6" v-if="stagerGenerating">Building...</div>
                        <div class="text-h6" v-else>Stager generated</div>
                      </q-card-section>
                      <q-card-section>
                        <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                          <div v-show="stagerDisplayed">
                            <vue-code-highlight class="language-python">
                            {{ stagerContent }}
                            </vue-code-highlight>
                          </div>
                        </transition>
                      </q-card-section>
                      <q-inner-loading :showing="stagerGenerating">
                        <q-spinner size="5em" color="teal" />
                      </q-inner-loading>
                    </q-card>
                  </q-step>
                  <template v-slot:navigation v-if="selectedIntegration !== null">
                    <q-stepper-navigation>
                      <q-btn v-if="step < 2" @click="$refs.stepper.next()" color="primary" label="Next" />
                      <q-btn v-if="step === 2" @click="createStager(), $refs.stepper.next()" color="primary" label="Generate" />
                      <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                    </q-stepper-navigation>
                  </template>
                </q-stepper>
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
import C2ModulesActive from 'components/C2Modules'
import { component as VueCodeHighlight } from 'vue-code-highlight'
import 'vue-code-highlight/themes/prism-okaidia.css'

export default {
  name: 'Stagers',
  components: {
    VueCodeHighlight,
    C2ModulesActive
  },
  data () {
    return {
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      selectedIntegration: null,
      selectedPlatform: 'Windows',
      selectedStager: null,
      tab: null,
      step: 1,
      integrationStagers: {},
      phaseTechniques: {
      },
      stagerPrompt: false,
      stagerContent: '',
      stagerGenerating: false,
      stagerDisplayed: false,
      selectedAgents: []
    }
  },
  created () {
    this.$getIntegrations()
  },
  sockets: {
    getStagers: function (response) {
      this.$axios
        .get(`/state/stagers/get/${response.task}`)
        .then(response => this.getStagersSuccess(response.data))
    },
    createStager: function (response) {
      this.$axios
        .get(`/state/stagers/create/${response.task}`)
        .then(response => this.createStagerSuccess(response.data))
    }
  },
  watch: {
    selectedIntegration: function (integration) {
      this.getStagers()
    },
    selectedPlatform: function (platform) {
      this.selectedStager = ''
    }
  },
  computed: {
    forgotRequired: {
      get () {
        var forgot = false
        const relatedStager = this.integrationStagers[this.selectedPlatform][this.selectedStager]['options']
        Object.keys(relatedStager).forEach(function (key) {
          if (relatedStager[key].default === '' && relatedStager[key].required) {
            forgot = true
          }
        })
        return forgot
      }
    },
    integrationOptions: {
      get () {
        const options = [
        ]
        for (const [key, value] of Object.entries(this.$store.state.integrations.integrationOptions)) {
          options.push({ 'value': key, 'label': key, 'disable': !value.enabled })
        }
        return options
      }
    }
  },
  methods: {
    isRequired (value, options) {
      return value === '' && options.required
    },
    getStagers () {
      this.$axios
        .get('/stagers/' + this.selectedIntegration)
    },
    getStagersSuccess (stagers) {
      this.integrationStagers = stagers
    },
    createStager () {
      var postData = { StagerName: this.selectedStager }
      const relatedStager = this.integrationStagers[this.selectedPlatform][this.selectedStager]['options']
      Object.keys(relatedStager).forEach(function (key) {
        if (relatedStager[key]['default'] !== '') {
          postData[key] = relatedStager[key]['default']
        }
      })
      this.stagerPrompt = true
      this.stagerGenerating = true
      this.stagerDisplayed = false
      this.$axios
        .post(`/stagers/${this.selectedIntegration}`, postData)
    },
    createStagerSuccess (stager) {
      this.stagerContent = stager['content']
      this.stagerDisplayed = true
      this.stagerGenerating = false
    }
  }
}
</script>
