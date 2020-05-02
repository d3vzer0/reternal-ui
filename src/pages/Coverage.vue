<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md row">
      <!-- Filter column -->
      <div class="col-3 col-xl-2">
        <div class="row q-mt-md">
          <div class="col">
            <q-toolbar class="bg-primary text-white shadow-2">
              <q-toolbar-title>Datasources</q-toolbar-title>
              {{ datasourceOptions.length }}
            </q-toolbar>
            <q-card flat class="filter-row">
              <q-card-section>
                <q-input v-model="filterDatasource">
                  <template v-slot:prepend>
                    <q-icon name="spellcheck" />
                  </template>
                </q-input>
                <q-list>
                  <q-item v-for="(datasource, index) in filtedDatasources"
                    :key="index" class="q-my-sm" clickable v-ripple @click="selectDatasource(datasource)">
                    <q-item-section>
                      <q-item-label>{{ datasource }}</q-item-label>
                      <q-item-label caption>
                        <q-linear-progress :value="averageScore(datasource)" class="q-mt-md" />
                      </q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-item-label caption>Mapped</q-item-label>
                      <q-icon name="check" v-if="coverage[datasource].enabled == true"/>
                      <q-icon name="close" v-else/>
                    </q-item-section>
                  </q-item>
                </q-list>
                <!-- <q-option-group :options="datasourceOptions.filter(datasource => datasource.label.includes(filterDatasource))" label="Actors" type="radio" v-model="selectedDatasource" /> -->
              </q-card-section>
            </q-card>
            <div class="div q-ml-xl q-mt-md">
              <q-pagination
                v-model="currentPage"
                :max="totalPages"
                :input="true">
              </q-pagination>
            </div>
          </div>
        </div>

        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col" v-if="selectedDatasource">
        <div class="row">
          <div class="col q-pl-md q-pa-md">
            <q-card flat class="my-card">
              <q-card-section>
                <div class="text-h6">{{ selectedDatasource }} <q-toggle for="enabled" v-model="enabled" /></div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col q-pa-sm">
                    <q-input filled v-model="date_registered" mask="date" label="Registration date">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="date_registered" @input="() => $refs.qDateProxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <div class="col q-pa-sm">
                    <q-input filled v-model="date_connected" mask="date" label="Connected date">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="date_connected" @input="() => $refs.qDateProxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
                <div class="row">
                  <div class="col q-pa-sm">
                    <q-editor v-model="comment" min-height="5rem" />
                  </div>
                </div>
                <div class="row">
                  <div class="col q-pa-sm">
                    <q-table title="Log sources" flat :data="datasourceProducts" :columns="columns" row-key="name">
                      <template v-slot:top="props">
                        <div class="col-3 q-table__title">Configured log sources</div>
                        <q-space />
                        <q-btn round flat icon="add" @click="addProductRow" class="q-ml-md" />
                      </template>
                      <template v-slot:body="props">
                        <q-tr :props="props">
                          <q-td key="name" :props="props">
                            {{ props.row.name }}
                            <q-popup-edit v-model="props.row.name">
                              <q-input v-model="props.row.name" dense autofocus counter />
                            </q-popup-edit>
                          </q-td>
                          <q-td key="vendor" :props="props">
                            {{ props.row.vendor }}
                            <q-popup-edit v-model="props.row.vendor">
                              <q-input v-model="props.row.vendor" dense autofocus counter />
                            </q-popup-edit>
                          </q-td>
                          <q-td key="source" :props="props">
                            {{ props.row.source }}
                            <q-popup-edit v-model="props.row.source">
                              <q-input v-model="props.row.source" dense autofocus counter />
                            </q-popup-edit>
                          </q-td>
                          <q-td key="sourcetype" :props="props">
                            {{ props.row.sourcetype }}
                            <q-popup-edit v-model="props.row.sourcetype">
                              <q-input v-model="props.row.sourcetype" dense autofocus counter />
                            </q-popup-edit>
                          </q-td>
                          <q-td key="index" :props="props">
                            {{ props.row.index }}
                            <q-popup-edit v-model="props.row.index">
                              <q-input v-model="props.row.index" dense autofocus counter />
                            </q-popup-edit>
                          </q-td>
                          <q-td key="delete" :props="props">
                            <q-btn dense flat icon="delete" @click="deleteProductRow(props.row)"/>
                          </q-td>
                        </q-tr>
                      </template>
                    </q-table>
                  </div>
                </div>
                <div class="row q-pt-lg">
                  <div class="col-6 q-pa-sm">
                      Devices: {{ device_completeness }}
                    <q-slider v-model="device_completeness" :min="0" :max="5" :step="1" label snap color="primary"/>
                  </div>
                  <div class="col-6 q-pa-sm">
                      Fields: {{ field_completeness }}
                    <q-slider v-model="field_completeness" :min="0" :max="5" :step="1" label snap/>
                  </div>
                  <div class="col-6 q-pa-sm">
                      Timeliness: {{ timeliness }}
                    <q-slider v-model="timeliness" :min="0" :max="5" :step="1" label snap/>
                  </div>
                  <div class="col-6 q-pa-sm">
                      Consistency: {{ consistency }}
                    <q-slider v-model="consistency" :min="0" :max="5" :step="1" label snap/>
                  </div>
                  <div class="col-6 q-pa-sm">
                      Retention: {{ retention }}
                    <q-slider v-model="retention" :min="0" :max="5" :step="1" label snap/>
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <q-btn color="primary" flat label="Save" @click="saveCoverage()"/>
                  </div>
                </div>
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
  name: 'Coverage',
  data () {
    return {
      currentPage: 1,
      maxRows: 15,
      selectedDatasource: null,
      selectedProductRow: null,
      filterDatasource: '',
      datasourceProducts: [],
      config: {
      },
      columns: [
        { name: 'name', label: 'Name', field: 'name' },
        { name: 'vendor', label: 'Vendor', field: 'vendor' },
        { name: 'source', label: 'Source', field: 'source' },
        { name: 'sourcetype', label: 'Sourcetype', field: 'sourcetype' },
        { name: 'index', label: 'Index', field: 'index' },
        { name: 'delete', label: 'Delete', field: 'delete' }
      ]
    }
  },
  created () {
    this.getDatasources()
    this.getCoverage()
  },
  computed: {
    filtedDatasources () {
      var filteredOptions = []
      this.datasourceOptions.forEach((datasource, index) => {
        if (datasource.includes(this.filterDatasource) && Math.ceil(index / this.maxRows) === this.currentPage) {
          filteredOptions.push(datasource)
        }
      })
      return filteredOptions
    },
    totalPages: function () {
      return Math.ceil(this.datasourceOptions.length / this.maxRows)
    },
    datasourceOptions: {
      set (datasources) {
        this.$store.commit('coverage/options', datasources)
      },
      get () {
        return this.$store.state.coverage.options
      }
    },
    coverage: {
      get () {
        return this.$store.state.coverage.config
      },
      set (datasource) {
        this.$store.commit('coverage/config', datasource)
      }
    },
    enabled: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].enabled
      },
      set (value) {
        this.$store.commit('coverage/enabled', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    date_registered: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].date_registered
      },
      set (value) {
        this.$store.commit('coverage/dateRegistered', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    date_connected: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].date_connected
      },
      set (value) {
        this.$store.commit('coverage/dateConnected', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    available_for_data_analytics: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].available_for_data_analytics
      },
      set (value) {
        this.$store.commit('coverage/dataAnalytics', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    comment: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].comment
      },
      set (value) {
        this.$store.commit('coverage/comment', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    device_completeness: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].data_quality.device_completeness
      },
      set (value) {
        this.$store.commit('coverage/deviceCompleteness', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    field_completeness: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].data_quality.field_completeness
      },
      set (value) {
        this.$store.commit('coverage/fieldCompleteness', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    timeliness: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].data_quality.timeliness
      },
      set (value) {
        this.$store.commit('coverage/timeliness', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    consistency: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].data_quality.consistency
      },
      set (value) {
        this.$store.commit('coverage/consistency', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    retention: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].data_quality.retention
      },
      set (value) {
        this.$store.commit('coverage/retention', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    },
    products: {
      get () {
        return this.$store.state.coverage.config[this.selectedDatasource].products
      },
      set (value) {
        this.$store.commit('coverage/products', { 'data_source_name': this.selectedDatasource, 'value': value })
      }
    }
  },
  methods: {
    deleteProductRow (row) {
      this.datasourceProducts = this.datasourceProducts.filter(e => !e.name.includes(row.name))
    },
    addProductRow () {
      this.datasourceProducts.push({
        name: 'New name',
        vendor: 'New vendor',
        source: 'New source',
        sourcetype: 'New sourcetype',
        index: 'New index'
      })
    },
    selectDatasource (datasource) {
      this.selectedDatasource = datasource
      this.datasourceProducts = []
      this.products.forEach(element => {
        this.datasourceProducts.push({
          name: element.name,
          vendor: element.vendor,
          source: element.source,
          sourcetype: element.sourcetype,
          index: element.index
        })
      })
    },
    averageScore (datasource) {
      var qualityObject = this.$store.state.coverage.config[datasource].data_quality
      return (qualityObject.field_completeness + qualityObject.consistency + qualityObject.device_completeness) / 15
    },
    getCoverage () {
      this.$axios
        .get('/mitre/coverage')
        .then(response => this.getCoverageSuccess(response['data']))
    },
    getCoverageSuccess (response) {
      response.forEach(coverage => {
        this.$store.commit('coverage/config', coverage)
      })
    },
    saveCoverage () {
      var updatedCoverage = this.$store.state.coverage.config[this.selectedDatasource]
      updatedCoverage['products'] = this.datasourceProducts
      this.$axios
        .post('/mitre/coverage', updatedCoverage)
        .then(response => this.saveCoverageSuccess(response['data']))
    },
    saveCoverageSuccess (response) {
      console.log(response)
    },
    getDatasources () {
      this.$axios
        .get('/mitre/datasources')
        .then(response => this.getDatasourcesSuccess(response['data']))
    },
    getDatasourcesSuccess (datasources) {
      datasources.forEach(datasource => {
        this.$store.commit('coverage/config', {
          data_source_name: datasource,
          date_registered: null,
          date_connected: null,
          available_for_data_analytics: false,
          enabled: false,
          products: [
          ],
          comment: '',
          data_quality: {
            device_completeness: 0,
            field_completeness: 0,
            timeliness: 0,
            consistency: 0,
            retention: 0
          }
        })
      })
      this.datasourceOptions = datasources
    }
  }
}
</script>
