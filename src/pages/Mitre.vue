<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md row">
      <!-- Filter column -->
      <div class="col-2">

        <!-- Dynamic filters -->
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-select v-model="selectedPhase" :options="phaseOptions" label="Phase"/>
              </q-card-section>
              <q-card-section>
                <q-checkbox v-model="filterCoverage" label="Datasource covered" />
              </q-card-section>
              <q-card-section>
                <q-option-group :options="platformOptions" label="Platform" type="radio" v-model="selectedPlatform" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-option-group :options="platformOptions" label="Platform" type="radio" v-model="selectedPlatform" />
              </q-card-section>
            </q-card>
          </div>
        </div> -->

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
        <!-- <div class="row">
          <div class="col q-pa-md">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :input="true">
            </q-pagination>
          </div>
        </div> -->
        <div class="row">
          <div class="col-3 q-pa-md" v-for="(phase, index) in techniqueOptions" v-bind:key="index">
            <q-card flat class="my-card">
              <q-card-section class="bg-primary text-white">
                <div class="text-h6">{{ index }}. {{ phase._id.kill_chain_phases | capitalize }}</div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-list separator>
                  <q-scroll-area style="height: 500px;">
                    <q-item v-ripple v-for="(technique, index) in phase.techniques" v-bind:key="index">
                      <q-item-section>
                        <q-item-label>
                          {{ technique.name }}
                        </q-item-label>
                        <q-item-label>
                          <q-rating readonly
                            v-model="testRating"
                            :max="5"
                            color="primary"
                          />
                        </q-item-label>
                      </q-item-section>
                      <q-item-section avatar>
                        <q-icon color="primary" name="help_outline" />
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
      testRating: 3,
      currentPage: 1,
      totalPages: 3,
      maxCols: 4,
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
      filterCoverage: false,
      selectedActor: '',
      searchTechnique: '',
      techniqueOptions: []
    }
  },
  computed: {
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
    },
    getRating (technique) {
      console.log(technique)
    }
  }
}
</script>