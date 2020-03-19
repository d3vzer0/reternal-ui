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
                <q-option-group :options="actors.filter(actor => actor.label.includes(filterActor))" label="Actors" type="radio" v-model="selectedActor" />
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
            <q-card flat class="my-card">
              <q-card-section>
                <div class="text-h6">Actor details</div>
                <div class="text-h7" v-if="!actorDetails.name">Select an actor to view details and filter techniques</div>
              </q-card-section>

              <q-card-section v-if="actorDetails.name">
                <div class="row">
                  <div class="col-2">
                    <b>Name</b>
                  </div>
                  <div class="col" >
                    {{ actorDetails.name }}
                  </div>
                </div>
                <div class="row">
                  <div class="col-2">
                    <b>Description</b>
                  </div>
                  <div class="col">
                    <q-markdown :src="actorDetails.description"></q-markdown>
                  </div>
                </div>
                <div class="row">
                  <div class="col-2">
                    <b>Aliases</b>
                  </div>
                  <div class="col">
                    {{ (actorDetails.aliases && actorDetails.aliases.length > 0) ? actorDetails.aliases.join(', ') : "" }}
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat>
              <q-tabs v-model="tab">
                <q-tab v-for="(phase, index) in phaseOptions" v-bind:key="index"
                  :name="phase" inline-label :label="phase">
                </q-tab>
              </q-tabs>
              <q-stepper v-model="phaseStep" animated vertical header-nav ref="stepper">
                <q-step v-for="(technique, index) in phaseTechniques[tab]" v-bind:key="index"
                  :name="technique.name" :title="technique.name" icon="details">
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
                            ${{ command.module }}
                          </template>
                          <div>
                            <q-markdown>
  ```
  {{ command.input }}
  ```
                            </q-markdown>
                          </div>
                          <div class="row" v-if="technique.commands.length > index + 1">
                            <div class="col">
                              <q-badge><q-icon name="timer" /> {{ command.sleep }}s</q-badge>
                            </div>
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
import VueMasonry from 'vue-masonry-css'
import Vue from 'vue'
Vue.use(VueMasonry)

export default {
  name: 'Agents',
  computed: {
  },
  data () {
    return {
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      tab: null,
      phaseStep: '',
      selectedPlatform: 'Windows',
      phaseOptions: [],
      phaseTechniques: {
      },
      selectedPhase: '',
      actors: [
        { 'value': '', 'label': 'Any' }
      ],
      actorDetails: {},
      selectedActor: '',
      filterActor: ''
    }
  },
  created () {
    this.getPhases()
    this.getActors()
  },
  watch: {
    selectedPlatform: function (platform) {
      this.phaseTechniques = {}
      this.getPhases()
    },
    tab: function (tab) {
      this.getTechniques()
    },
    selectedActor: function (actor) {
      this.phaseTechniques = {}
      this.phaseOptions = []
      this.getPhases()
      if (actor !== '') {
        this.getActorDetails(actor)
      } else {
        this.actorDetails = { }
      }
    }
  },
  methods: {
    getActors () {
      this.$axios
        .get('/mapping/actors')
        .then(response => this.getActorsSuccess(response['data']))
    },
    getActorsSuccess (actors) {
      actors.forEach(actor => {
        this.actors.push({ 'value': actor, 'label': actor })
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
    getPhases () {
      this.$axios
        .get('/mapping/techniques/distinct', {
          params: {
            platform: this.selectedPlatform,
            actor: this.selectedActor,
            distinct: 'kill_chain_phase'
          }
        })
        .then(response => this.getPhasesSuccess(response['data']))
    },
    getPhasesSuccess (phases) {
      this.phaseOptions = phases
      this.tab = this.phaseOptions[0]
      this.getTechniques()
    },
    getTechniques () {
      this.$axios
        .get('/mapping/techniques', {
          params: {
            platform: this.selectedPlatform,
            actor: this.selectedActor,
            phase: this.tab,
            technique: ''
          }
        })
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
          reference_id: technique._id['$oid'],
          technique_name: technique.technique_name,
          kill_chain_phase: technique.kill_chain_phase,
          technique_id: technique.technique_id,
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
