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
               :params="queryParams">
            </search-select>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <search-select store='sigma' id='techniques.references.external_id' title='Technique'
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
            <search-filter store='sigma' id='techniques.data_sources' title='Datasource'
             :params="queryParams">
            </search-filter>
          </div>
        </div>
        <div class="row q-mt-md">
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
        </div>
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
                  :name="phase.label" inline-label :label="phase.label">
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
      filterFields: [
        'status',
        'level',
        'tags',
        'techniques.name',
        'techniques.references.external_id',
        'techniques.kill_chain_phases',
        'techniques.magma.l1_usecase_name',
        'techniques.magma.l2_usecase_name',
        'techniques.data_sources'
      ],
      queryParams: {
        search: '',
        tags: '',
        status: '',
        level: '',
        integration: '',
        'techniques.references.external_id': '',
        'techniques.name': '',
        'techniques.kill_chain_phases': '',
        'techniques.magma.l1_usecase_name': '',
        'techniques.magma.l2_usecase_name': '',
        'techniques.data_sources': ''
      },
      phaseStep: '',
      phaseSelected: '',
      phaseSigma: {
      },
      sigmaRules: [
      ],
      techniqueColumns: [
        { name: 'name', label: 'Technique', field: 'name' },
        { name: 'data_sources', label: 'Datasources', field: 'data_sources' }
      ]
    }
  },
  computed: {
    searchFilters () {
      return this.$store.state.sigma.queryParams
    },
    phaseOptions () {
      return this.$store.state.sigma.filterValues['techniques.kill_chain_phases']
    }
  },
  created () {
    this.refreshFilters()
    this.getDistinct()
  },
  watch: {
    searchFilters: {
      handler (value) {
        console.log(123123)
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
      // if (this.$route.query) {
      //   for (let [key, value] of Object.entries(this.$route.query)) {
      //     this.$store.commit('sigma/setQueryParam', { id: key, value: value })
      //   }
      // }
      this.getDistinct()
    },
    getDistinct () {
      this.$axios
        .get('/sigma/distinct', {
          params: { ...this.searchFilters, fields: this.filterFields.join(',') }
        })
        .then(response => this.$store.commit('sigma/setFilterValues', response['data']))
    },
    getSigma () {
      var queryParams = { ...this.searchFilters, phase: this.phaseSelected }
      this.$axios
        .get('/sigma', { params: queryParams })
        .then(response => this.getSigmaSuccess(response['data']))
    },
    getSigmaSuccess (rules) {
      this.sigmaRules = rules
    }
  }
}
</script>
