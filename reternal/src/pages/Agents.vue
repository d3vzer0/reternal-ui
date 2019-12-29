<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-2">

        <!-- Dynamic filters -->
         <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="searchTechnique" label="Agent " />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-option-group :options="platformOptions" label="Platform" type="radio" v-model="selectedPlatform" />
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
      selectedPlatform: 'Windows',
      selectedPhase: '',
      searchTechnique: '',
      techniqueOptions: []
    }
  },
  created () {
  },
  watch: {
    selectedPlatform: function (platform) {
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
    getTechniquesSuccess (techniques) {
      this.techniqueOptions = techniques
      // techniques.forEach(technique => {
      //   this.techniqueOptions.push(technique)
      // })
    }
  }
}
</script>
