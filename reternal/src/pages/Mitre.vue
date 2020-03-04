<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-2">

        <!-- Dynamic filters -->
         <!-- <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="searchTechnique" label="Technique " />
              </q-card-section>
            </q-card>
          </div>
        </div> -->

        <div class="row q-mt-md">
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
                <q-select v-model="selectedPhase" :options="phaseOptions" label="Phase"/>
                  <!-- <template v-slot:prepend>
                    <q-icon name="my_location" />
                  </template> -->
                <!-- </q-select> -->
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
                <q-option-group :options="actorOptions.filter(actor => actor.label.includes(filterActor))" label="Actors" type="radio" v-model="selectedActor" />
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
          <masonry :cols="3" gutter="5">
            <div class="col q-pa-md" v-for="(phase, index) in techniqueOptions" v-bind:key="index">
              <q-card flat class="my-card">
                <q-card-section>
                  <div class="text-h6">{{ phase._id.kill_chain_phases }}</div>
                </q-card-section>
                <q-card-section>
                  <q-list separator>
                    <q-item clickable v-ripple v-for="(technique, index) in phase.techniques" v-bind:key="index">
                      <q-item-section>{{ technique.name }}</q-item-section>
                      <q-item-section avatar>
                        <q-icon color="primary" name="help_outline" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>
          </masonry>
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
  name: 'Mitre',
  computed: {
  },
  data () {
    return {
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      selectedPlatform: 'Windows',
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
      selectedActor: '',
      searchTechnique: '',
      techniqueOptions: []
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
    getActorDetailsSuccess (details) {
      this.actorDetails = details
    },
    getActorTechniques (actor) {
      this.$axios
        .get('/mapping/actors/' + actor)
        .then(response => this.getActorTechniquesSuccess(response['data']))
    },
    getActorTechniquesSuccess (techniques) {
      this.actorTechniques = {
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
        this.actorTechniques[technique.kill_chain_phase].push(technique)
      })
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
        .get('mitre/by_phase', {
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
      // techniques.forEach(technique => {
      //   this.techniqueOptions.push(technique)
      // })
    }
  }
}
</script>
