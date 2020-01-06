<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md justify-center row">
      <!-- Results column -->
      <div class="col-8">
        <q-card class="q-pl-md q-pt-md" flat>
          <q-stepper v-model="step" ref="stepper" color="primary" animated >
            <q-step :name="1" title="Select C2 module" icon="settings" :done="step > 1">
              <q-list>
                <q-item tag="label" v-ripple v-for="(metadata, integration) in integrationOptions" v-bind:key="integration">
                  <q-item-section avatar>
                    <q-radio v-model="selectedIntegration" color="teal" :val="integration"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ metadata.name }}</q-item-label>
                    <q-item-label caption>
                       {{ metadata.description }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step :name="2" title="Select platform" icon="settings" :done="step > 2">
              <q-list v-if="selectedIntegration">
                <q-item tag="label" v-ripple v-for="(stagers, platform) in integrationStagers" v-bind:key="platform">
                  <q-item-section avatar>
                    <q-radio v-model="selectedPlatform" :val="platform" color="teal" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{platform}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step :name="3" title="Select stager" icon="settings" :done="step > 3">
              <q-list v-if="selectedPlatform">
                <q-item tag="label" v-ripple v-for="(options, stager) in integrationStagers[selectedPlatform]" v-bind:key="stager">
                  <q-item-section avatar>
                    <q-radio v-model="selectedStager" :val="stager" color="teal" />
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
            <q-step :name="4" title="Configure stager" icon="settings" :done="step > 3">
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
            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
                <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card>
      </div>
      <!-- /Results column -->

    </div>
    <!-- /Center content row -->
  </q-page>
</template>

<script>
import VueMasonry from 'vue-masonry-css'
import Vue from 'vue'
Vue.use(VueMasonry)

export default {
  name: 'Stagers',
  data () {
    return {
      selectedIntegration: '',
      selectedPlatform: '',
      selectedStager: '',
      tab: null,
      step: 1,
      integrationStagers: {},
      phaseTechniques: {
      },
      selectedAgents: []
    }
  },
  created () {
  },
  watch: {
    selectedIntegration: function (integration) {
      this.getStagers()
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
    queuedCommands: {
      get () {
        return this.$store.state.queue.commands
      }
    },
    integrationOptions: {
      get () {
        return this.$store.state.integrations.integrationOptions
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
        .then(response => this.getStagersSuccess(response['data']))
    },
    getStagersSuccess (stagers) {
      this.integrationStagers = stagers
    }
  }
}
</script>
