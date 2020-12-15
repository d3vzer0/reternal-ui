<template>
  <q-page>
    <div class="q-pa-md row">
      <q-dialog v-model="packageProcessing" seamless position="top">
        <q-card style="width: 350px">
          <q-linear-progress indeterminate color="pink" />

          <q-card-section class="row items-center no-wrap">
            <div>
              <div class="text-weight-bold">Packaging...</div>
              <div class="text-grey">Converting SIGMA rules to {{ packageFormat }}</div>
            </div>
            <q-space />
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Filter column -->
      <div class="col-sm-3 col-md-2 col-xs-4">
        <div class="row justify-end">
          <div class="col">
            <q-card flat>
              <q-file
                v-model="configFiles"
                label="Sigma config files"
                accept=".yml, application/x-yaml"
                class="q-pa-sm"
                clearable
                style="max-width: 100%">
              </q-file>
              <q-btn style="width: 100%;" square unelevated color="primary" icon="get_app" label="Package" :disable="configFiles ? false : true">
                <q-menu fit>
                  <q-list>
                    <q-item clickable unelevated>
                      <q-item-section>Splunk</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu anchor="top right" self="top left">
                        <q-list>
                          <q-item clickable v-close-popup  @click="packageRules('splunk')">
                            <q-item-section>Enriched Splunk App (.tar.gz)</q-item-section>
                          </q-item>
                        </q-list>
                      </q-menu>
                    </q-item>
                    <q-item clickable unelevated disabled>
                      <q-item-section>ElasticSearch</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu anchor="top right" self="top left">
                        <q-list>
                          <!-- <q-item clickable v-close-popup>
                            <q-item-section>Raw Searches</q-item-section>
                          </q-item> -->
                        </q-list>
                      </q-menu>
                    </q-item>
                    <q-item clickable unelevated disabled>
                      <q-item-section>Sentinel</q-item-section>
                      <q-item-section side>
                        <q-icon name="keyboard_arrow_right" />
                      </q-item-section>
                      <q-menu anchor="top right" self="top left">
                        <q-list>
                          <!-- <q-item clickable v-close-popup>
                            <q-item-section>Raw Searches</q-item-section>
                          </q-item> -->
                        </q-list>
                      </q-menu>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-card>
            <!-- <q-btn color="primary" round icon="add"/> -->
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-select store='sigma' id='tags' title='Tags'
               :params="queryParams">
            </search-select>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-select store='sigma' id='technique' title='Technique'
              :params="queryParams">
            </search-select>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='status' title='Status'
             :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='level' title='Level'
              :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='data_source' title='Datasource'
             :params="queryParams">
            </search-filter>
          </div>
        </div>
        <!-- <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='techniques.magma.l1_usecase_name' title='L1 Usecase'
             :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-filter store='sigma' id='techniques.magma.l2_usecase_name' title='L2 Usecase'
              :params="queryParams">
            </search-filter>
          </div>
        </div> -->
        <!-- /Filters -->
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
            <!-- <q-card flat v-if="phaseOptions.length === 0">
              <q-card-section>
                <div class="text-h6">
                  <span>No hunts found</span>
                </div>
              </q-card-section>
            </q-card> -->
            <q-card flat>
              <q-tabs v-model="phaseSelected">
                <q-tab v-for="(phase, index) in phaseOptions" v-bind:key="index"
                  :name="phase.value" inline-label :label="phase.label">
                </q-tab>
              </q-tabs>
              <q-stepper v-model="phaseStep" animated vertical header-nav ref="stepper">
                <q-step v-for="(rule, index) in sigmaRules" v-bind:key="index"
                  :name="rule.hash" :title="`${rule.title}`" icon="details">
                  <div class="row">
                    <div class="col">
                      <div>
                        <vue-code-highlight language="yaml">
                          <pre>{{dumpYAML(rule)}}</pre>
                        </vue-code-highlight>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-table
                        flat
                        :data="rule.techniques"
                        :columns="techniqueColumns"
                        row-key="name"
                        >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td key="name" :props="props">
                              {{ props.row.name }}
                            </q-td>
                            <q-td key="data_sources" :props="props">
                               <span v-for="datasource in props.row.data_sources" v-bind:key="datasource">
                                  <q-chip clickable v-if="props.row.data_sources_available.includes(datasource)" color="teal" text-color="white" icon="done" @click="$router.push({ path: '/coverage', query: { datasource: datasource } })">{{ datasource }}</q-chip>
                                  <q-chip clickable v-else icon="highlight_off" @click="$router.push({ path: '/coverage', query: { datasource: datasource } })">{{ datasource }}</q-chip>
                               </span>
                            </q-td>
                          </q-tr>
                        </template>
                      </q-table>
                    </div>
                  </div>
                </q-step>
              </q-stepper>
            </q-card>
          </div>
        </div>
        <div class="row">
          <div class="col no-shadow-pagination">
            <q-pagination
              flat
              v-model="currentPage"
              :max="maxPages"
              :max-pages="6"
              :input="true"
            >
            </q-pagination>
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
import SearchFilter from 'components/SearchFilterDistinct'
import SearchSelect from 'components/SearchSelectDistinct'
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
      packageProcessing: false,
      configFiles: null,
      packageFormat: 'splunk',
      packageNames: {
        'splunk': 'splunk_sigma_rules.tar.gz',
        'sentinel': 'sentinel_sigma_rules.json',
        'elasticsearch': 'elastic_sigma_rules.json'
      },
      maxResults: 10,
      resultsTotal: 0,
      currentPage: 1,
      filterFields: [
        'status',
        'level',
        'tags',
        'technique',
        'actor',
        'phase',
        'data_source'
      ],
      queryParams: {
        search: '',
        tags: '',
        status: '',
        level: '',
        actor: '',
        integration: '',
        technique: '',
        phase: '',
        data_source: ''
      },
      phaseStep: '',
      phaseSelected: '',
      phaseSigma: {
      },
      sigmaRules: [
      ],
      techniqueColumns: [
        { name: 'name', label: 'Technique', field: 'name', align: 'left' },
        { name: 'data_sources', label: 'Datasources', field: 'data_sources', align: 'left' }
      ]
    }
  },
  computed: {
    maxPages () {
      return Math.floor((this.resultsTotal + this.maxResults - 1) / this.maxResults)
    },
    searchSkip () {
      return (this.currentPage - 1) * this.maxResults
    },
    searchLimit () {
      return this.currentPage * this.maxResults
    },
    searchFilters () {
      return this.$store.state.sigma.queryParams
    },
    phaseOptions () {
      return this.$store.state.sigma.filterValues['phase']
    }
  },
  sockets: {
    createSigmaPackage: function (data) {
      this.getPackage(data['task'])
    }
  },
  created () {
    this.getDistinct()
    this.getSigma()
  },
  watch: {
    searchFilters: {
      handler (value) {
        if (JSON.stringify(this.$route.query) !== JSON.stringify(this.searchFilters)) {
          this.$router.replace({ path: '/sigma', query: this.searchFilters })
        }
        this.refreshFilters()
      }
    },
    phaseSelected: function (tab) {
      if (typeof tab !== 'undefined') {
        this.getSigma()
      }
    },
    currentPage: {
      handler (value) {
        this.getSigma()
      }
    }
  },
  methods: {
    getPackage (uid) {
      var url = `/sigma/package/${this.packageFormat}/${uid}`
      this.$axios({
        method: 'get',
        url,
        responseType: 'arraybuffer'
      })
        .then(response => this.getPackageSuccess(response['data']))
    },
    getPackageSuccess (data) {
      this.packageProcessing = false
      var downloadUrl = window.URL.createObjectURL(new Blob([data]))
      var downloadLink = document.createElement('a')
      downloadLink.href = downloadUrl
      downloadLink.setAttribute('download', this.packageNames[this.packageFormat])
      document.body.appendChild(downloadLink)
      downloadLink.click()
    },
    packageRules (target) {
      this.packageFormat = target
      this.packageProcessing = true
      let reader = new FileReader()
      reader.readAsText(this.configFiles)
      reader.onload = () => {
        var queryParams = {
          ...this.searchFilters,
          phase: this.phaseSelected
        }
        this.$axios
          .post(`/sigma/package/${target}`,
            YAML.safeLoad(reader.result),
            { params: queryParams })
      }
    },
    dumpYAML (data) {
      const clonedRule = Object.assign({ id: data.sigma_id }, data)
      let { _id, techniques, technique, hash, ...slimRule } = clonedRule
      delete slimRule['sigma_id']
      return YAML.safeDump(slimRule)
    },
    refreshFilters () {
      // if (this.$route.query) {
      //   for (let [key, value] of Object.entries(this.$route.query)) {
      //     this.$store.commit('sigma/setQueryParam', { id: key, value: value })
      //   }
      // }
      this.getDistinct()
      this.getSigma()
    },
    getDistinct () {
      this.$axios
        .get('/sigma/distinct', {
          params: { ...this.searchFilters, fields: this.filterFields.join(',') }
        })
        .then(response => this.$store.commit('sigma/setFilterValues', response['data']))
    },
    getSigma () {
      var queryParams = {
        ...this.searchFilters,
        phase: this.phaseSelected,
        skip: this.searchSkip,
        limit: this.searchLimit
      }
      this.$axios
        .get('/sigma', { params: queryParams })
        .then(response => this.getSigmaSuccess(response['data']))
    },
    getSigmaSuccess (rules) {
      this.resultsTotal = rules.total
      this.sigmaRules = rules.results
    }
  }
}
</script>

<style lang="scss">
.no-shadow-pagination {
  box-shadow: 0 !important;
  .q-btn {
    span {
      border-radius: 0;
    }
    box-shadow: 0;
    border-radius: 0px !important;
  }
}
</style>
