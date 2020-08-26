<template>
  <q-page>
    <div class="q-pa-md row">
      <!-- Filter column -->
      <div class="col-2">
        <div class="row justify-end">
          <div class="col">
            <q-btn style="width: 100%;" unelevated color="primary" icon="add" label="Package">
              <q-menu fit>
                <q-list>
                  <q-item clickable unelevated>
                    <q-item-section>Splunk</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu anchor="top right" self="top left">
                      <q-list>
                        <q-item clickable v-close-popup>
                          <q-item-section>Splunk App Package</q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>Raw Searches</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                  <q-item clickable unelevated>
                    <q-item-section>ElasticSearch</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu anchor="top right" self="top left">
                      <q-list>
                        <q-item clickable v-close-popup>
                          <q-item-section>Raw Searches</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                  <q-item clickable unelevated>
                    <q-item-section>Sentinel</q-item-section>
                    <q-item-section side>
                      <q-icon name="keyboard_arrow_right" />
                    </q-item-section>
                    <q-menu anchor="top right" self="top left">
                      <q-list>
                        <q-item clickable v-close-popup>
                          <q-item-section>Raw Searches</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
            <!-- <q-btn color="primary" round icon="add"/> -->
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-select store='sigma' id='tags' title='Tags'
              endpoint='/sigma/tags' :params="queryParams">
            </search-select>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-select store='sigma' id='technique_id' title='Technique'
              endpoint='/sigma/techniqueids' :params="queryParams">
            </search-select>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='status' title='Status'
              endpoint='/sigma/status' :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='level' title='Level'
              endpoint='/sigma/level' :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='phase' title='Tactic'
              endpoint='/sigma/phases' :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='datasource' title='Datasource'
              endpoint='/sigma/datasources' :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='l1usecase' title='L1 Usecase'
              endpoint='/sigma/l1usecases' :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='l2usecase' title='L2 Usecase'
              endpoint='/sigma/l2usecases' :params="queryParams">
            </search-filter>
          </div>
        </div>
        <!-- /Filters-->
      </div>
      <!-- Results column -->
      <div class="col q-pl-md">
        <div class="row">
          <div class="col">
            <search-text store="sigma" id="search" title="Search"></search-text>
          </div>
        </div>
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
              <q-tabs v-model="phaseSelected">
                <q-tab v-for="(phase, index) in phaseOptions" v-bind:key="index"
                  :name="phase" inline-label :label="phase">
                </q-tab>
              </q-tabs>
              <q-stepper v-model="phaseStep" animated vertical header-nav ref="stepper">
                <q-step v-for="(rule, index) in phaseSigma[phaseSelected]" v-bind:key="index"
                  :name="rule.hash" :title="`${rule.title} (${rule.technique.name} / ${rule.technique.references[0].external_id})`" icon="details">
                  <div class="row">
                    <div class="col">
                      <div>
                        <vue-code-highlight language="yaml">
                          <pre>{{dumpYAML(rule)}}</pre>
                        </vue-code-highlight>
                      </div>
                    </div>
                  </div>
                  <div class="row q-mt-md">
                    <div class="col">
                      {{ rule.data_sources }}
                      <span v-for="datasource in rule.technique.data_sources" v-bind:key="datasource">
                        <q-chip clickable v-if="rule.technique.data_sources_available.includes(datasource)"
                        {{ rule }}
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
  </q-page>
</template>

<script>
import { component as VueCodeHighlight } from 'vue-code-highlight'
import 'vue-code-highlight/themes/prism-okaidia.css'
import 'prism-es6/components/prism-markup-templating'
import 'prism-es6/components/prism-yaml'
import SearchFilter from 'components/SearchFilter'
import SearchSelect from 'components/SearchSelect'
import SearchText from 'components/SearchText'
import YAML from 'js-yaml'

export default {
  name: 'Sigma',
  components: {
    VueCodeHighlight,
    SearchFilter,
    SearchSelect,
    SearchText
  },
  data () {
    return {
      queryParams: {
        search: '',
        tags: '',
        technique_id: '',
        integration: '',
        technique: '',
        phase: '',
        l1usecase: '',
        l2usecase: '',
        datasource: '',
        status: '',
        level: ''
      },
      phaseStep: '',
      phaseSelected: '',
      phaseOptions: [
      ],
      phaseSigma: {
      }
    }
  },
  computed: {
    searchFilters () {
      return this.$store.state.sigma.queryParams
    }
  },
  created () {
    this.refreshFilters()
  },
  watch: {
    searchFilters: {
      handler (value) {
        if (JSON.stringify(this.$route.query) !== JSON.stringify(this.searchFilters)) {
          this.$router.replace({ path: '/sigma', query: this.searchFilters })
        }
        this.refreshFilters()
      },
      deep: true
    },
    phaseSelected: function (tab) {
      if (typeof tab !== 'undefined') {
        this.getSigma()
      }
    }
  },
  methods: {
    dumpYAML (data) {
      const clonedRule = Object.assign({ id: data.sigma_id }, data)
      let { _id, techniques, technique, hash, ...slimRule } = clonedRule
      delete slimRule['sigma_id']
      return YAML.safeDump(slimRule)
    },
    refreshFilters () {
      if (this.$route.query) {
        for (let [key, value] of Object.entries(this.$route.query)) {
          this.$store.commit('sigma/setQueryParam', { id: key, value: value })
        }
      }
      this.getPhases()
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
      this.phaseSelected = this.phaseOptions[0]
    },
    getSigma () {
      var queryParams = { ...this.searchFilters, phase: this.phaseSelected }
      this.$axios
        .get('/sigma', { params: queryParams })
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
        'command-and-control': { },
        'impact': { }
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
    }
  }
}
</script>
