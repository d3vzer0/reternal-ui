<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-mt-md row justify-around q-gutter-sm">
      <div class="col-xs-11 col-sm-5 col-md-5 col-lg-5 col-xl-5">
        <C2ModulesActive></C2ModulesActive>
      </div>
      <div class="col-xs-11 col-sm-5 col-md-5 col-lg-5 col-xl-5">
        <SearchModulesActive></SearchModulesActive>
      </div>
    </div>
    <div class="q-mt-md row justify-around q-gutter-sm">
      <!-- Filter column -->
      <div class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3">
        <q-card class="metric">
          <q-card-section horizontal>
            <q-card-section>
             <div class="text-h2 text-bold q-mt-sm q-mb-xs">
               {{ rulesCount }}
             </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Rules
              </div>
              <div class="text-caption text-grey">
                Amount of hunts or sigma rules available
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3">
        <q-card class="metric">
          <q-card-section horizontal>
            <q-card-section>
             <div class="text-h2 q-mt-sm q-mb-xs text-bold">
               {{ techniquesCount }}
             </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Commands
              </div>
              <div class="text-caption text-grey">
                Amount of C2 commands mapped to ATTCK
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
       <div class="col-xs-11 col-sm-5 col-md-3 col-lg-3 col-xl-3">
        <q-card class="metric">
          <q-card-section horizontal>
            <q-card-section>
             <div class="text-h2 q-mt-sm q-mb-xs text-bold">
               {{ coverageCount }}
             </div>
            </q-card-section>
            <q-card-section>
              <div class="text-h5 q-mt-sm q-mb-xs">
                Datasources
              </div>
              <div class="text-caption text-grey">
                 Number of datasources mapped to the DeTTECT framework
              </div>
            </q-card-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import C2ModulesActive from 'components/C2Modules'
import SearchModulesActive from 'components/SearchModules'

export default {
  name: 'PageIndex',
  components: {
    C2ModulesActive,
    SearchModulesActive
  },
  computed: {
    integrationOptions: {
      get () {
        return this.$store.state.integrations.integrationOptions
      }
    }
  },
  data () {
    return {
      techniquesCount: 0,
      coverageCount: 0,
      rulesCount: 0,
      selectedIntegration: null,
      showDescription: false,
      techniques: [],
      campaigns: [],
      platforms: [],
      columnsTechniques: [
        { name: '_id', align: 'left', label: 'Phase', field: '_id', sortable: true },
        { name: 'count', align: 'right', label: 'Techniques', field: 'count', sortable: true }
      ],
      columnsPlatform: [
        { name: '_id', align: 'left', label: 'Platform', field: '_id', sortable: true },
        { name: 'count', align: 'right', label: 'Techniques', field: 'count', sortable: true }
      ]
    }
  },
  created () {
    // this.$getIntegrations()
    // this.$getSearchIntegrations()
    this.getCountTechniques()
    this.getCountRules()
    this.getCountCoverage()
  },
  methods: {
    getCountTechniques () {
      this.$axios
        .get('/stats/count/techniques')
        .then(response => this.getCountTechniquesSuccess(response['data']))
    },
    getCountTechniquesSuccess (response) {
      this.techniquesCount = response.count
    },
    getCountRules () {
      this.$axios
        .get('/stats/count/rules')
        .then(response => this.getCountRulesSuccess(response['data']))
    },
    getCountRulesSuccess (response) {
      this.rulesCount = response.count
    },
    getCountCoverage () {
      this.$axios
        .get('/stats/count/coverage')
        .then(response => this.getCountCoverageSuccess(response['data']))
    },
    getCountCoverageSuccess (response) {
      this.coverageCount = response.count
    },
    getTechniquesCount () {
      this.$axios
        .get('/mapping/count?by=phase')
        .then(response => this.getTechniquesCountSuccess(response['data']))
    },
    getTechniquesCountSuccess (response) {
      this.techniques = response
    },
    getPlatformCount () {
      this.$axios
        .get('/mapping/count?by=platform')
        .then(response => this.getPlatformCountSuccess(response['data']))
    },
    getPlatformCountSuccess (response) {
      this.platforms = response
    }
  }
}
</script>

<style lang="scss" scoped>

.metric {
  height: 150px;
}

.tasks-table {
  height: 100%;
}

.fas {
  font-size: 20px !important;
}
</style>
