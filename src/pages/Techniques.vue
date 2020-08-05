<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <div class="col-2">
        <!-- Dynamic filters -->
        <div class="row">
          <div class="col">
            <search-filter store='techniques' id='platform' title='Platform'
              :params="queryParams" endpoint="/mapping/platforms">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='techniques' id='actor' title='Actor'
              :params="queryParams" endpoint="/mapping/actors">
            </search-filter>
          </div>
        </div>
        <!-- /Dynamic filters-->
      </div>
      <!-- Results column -->
      <div class="col q-pl-md">
        <div class="row">
          <div class="col">
            <actor-details :name="selectedActor"></actor-details>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-text store="techniques" id="search" title="Search"></search-text>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-card flat>
              <q-tabs v-model="phaseSelected">
                <q-tab v-for="(phase, index) in phaseOptions" v-bind:key="index"
                  :name="phase" inline-label :label="phase">
                </q-tab>
              </q-tabs>
              <q-stepper v-model="phaseStep" animated vertical header-nav ref="stepper">
                <q-step v-for="(technique, index) in phaseTechniques[phaseSelected]" v-bind:key="index"
                  :name="technique.name" :title="`${technique.technique_name} (${technique.name})`" icon="details">
                  <div class="row">
                    <div class="col-2">
                      <b>Name</b>
                    </div>
                    <div class="col">
                      {{ technique.name }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>Ref. ID</b>
                    </div>
                    <div class="col">
                      {{ technique.external_id}}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>Platform</b>
                    </div>
                    <div class="col">
                      {{ technique.platform }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-2">
                      <b>Description</b>
                    </div>
                    <div class="col">
                      {{ technique.description }}
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-timeline>
                        <q-timeline-entry v-for="(command, index) in technique.commands" v-bind:key="index">
                          <template v-slot:subtitle>
                            ${{ command.module }} / {{ command.integration }}
                          </template>
                          <div>
                            <vue-code-highlight language="yaml">
                              <pre>{{ dumpYAML(command.input) }}</pre>
                            </vue-code-highlight>
                          </div>
                        </q-timeline-entry>
                      </q-timeline>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-btn color="primary" v-on:click="addToQueue(technique)" unelevated icon="add_to_queue" size="sm" label="Add to queue"/>
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
import SearchFilter from 'components/SearchFilter'
import ActorDetails from 'components/ActorDetails'
import 'vue-code-highlight/themes/prism-okaidia.css'
import 'prism-es6/components/prism-markup-templating'
import 'prism-es6/components/prism-yaml'
import YAML from 'js-yaml'
import SearchText from 'components/SearchText'

export default {
  name: 'Agents',
  components: {
    VueCodeHighlight,
    ActorDetails,
    SearchFilter,
    SearchText
  },
  data () {
    return {
      queryParams: {
        actor: '',
        platform: '',
        search: ''
      },
      phaseSelected: '',
      phaseStep: '',
      phaseOptions: [],
      phaseTechniques: {
      }
    }
  },
  created () {
    this.getPhases()
  },
  computed: {
    searchFilters () {
      return this.$store.state.techniques.queryParams
    },
    selectedActor () {
      return this.$store.state.techniques.queryParams.actor
    }
  },
  watch: {
    searchFilters: {
      handler (value) {
        if (JSON.stringify(this.$route.query) !== JSON.stringify(this.searchFilters)) {
          this.$router.replace({ path: '/techniques', query: this.searchFilters })
        }
        this.refreshFilters()
      },
      deep: true
    },
    phaseSelected: function (tab) {
      this.getTechniques()
    }
  },
  methods: {
    dumpYAML (data) {
      return YAML.safeDump(data)
    },
    refreshFilters () {
      if (this.$route.query) {
        for (let [key, value] of Object.entries(this.$route.query)) {
          this.$store.commit('techniques/setQueryParam', { id: key, value: value })
        }
      }
      this.getPhases()
    },
    getPhases () {
      this.$axios
        .get('/mapping/phases', { params: this.searchFilters })
        .then(response => this.getPhasesSuccess(response['data']))
    },
    getPhasesSuccess (phases) {
      this.phaseOptions = phases
      this.phaseSelected = this.phaseOptions[0]
    },
    getTechniques () {
      var queryParams = { ...this.searchFilters, phase: this.phaseSelected }
      this.$axios
        .get('/mapping/techniques', { params: { queryParams } })
        .then(response => this.getTechniquesSuccess(response['data']))
    },
    getTechniquesSuccess (techniques) {
      this.phaseTechniques = {
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
      techniques.forEach(technique => {
        this.phaseTechniques[technique.kill_chain_phase].push(technique)
      })
    },
    addToQueue (technique) {
      technique.commands.forEach(command => {
        var randomArray = new Uint32Array(5)
        var randomId = window.crypto.getRandomValues(randomArray)[2]
        var commandOptions = {
          reference_name: technique.name,
          reference_id: technique._id,
          technique_name: technique.technique_name,
          kill_chain_phase: technique.kill_chain_phase,
          technique_id: technique.technique_id,
          integration: command.integration,
          name: command.name,
          input: command.input,
          sleep: command.sleep,
          rand: randomId,
          category: 'Mitre',
          module: command.module
        }
        this.$store.commit('queue/addCommand', commandOptions)
      })
    }
  }
}
</script>
