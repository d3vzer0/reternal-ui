<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md row">
      <!-- Filter column -->
      <div class="col-md-4 col-xs-5 col-xl-2 q-mt-md" style="max-width: 350px;">
        <q-card flat>
          <q-table flat :data="filtedDatasources" :columns="datasourceColumns" :filter="filterDatasource"
          :pagination.sync="datasourcePagination">
            <template v-slot:top>
              <q-input borderless dense debounce="100" v-model="filterDatasource" placeholder="Search" style="width:100%;">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </template>
            <template v-slot:body-cell-name="props">
              <q-td :props="props">
                <q-item @click.native="selectDatasource(props.value)">
                  <q-item-section>
                    <q-item-label>{{ props.value }}</q-item-label>
                    <q-item-label caption>
                      <q-linear-progress :value="averageScore(props.value)" class="q-mt-md" />
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-item-label caption>Available</q-item-label>
                    <q-icon name="check" v-if="coverage[props.value].products.length > 0" class="dsavailable" />
                    <q-icon name="close" v-else class="dsmissing"/>
                  </q-item-section>
                </q-item>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col">
        <div class="row">
          <div class="col q-pl-md q-pa-md">
            <q-card flat v-if="!selectedDatasource">
              <q-card-section>
                <div class="text-h6">
                  <span>No datasource selected</span>
                  <span class="float-right">
                    <q-btn disable flat icon="refresh" label="Sync datasources" @click="syncDatasources()"/>
                  </span>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat v-else>
              <q-card-section>
                <div class="text-h6">
                   <!-- <q-toggle for="enabled" v-model="enabled"/> -->
                  <span>{{ selectedDatasource }}</span>
                  <span class="float-right">
                    <q-btn flat icon="policy" label="Sigma rules" @click="$router.push({ path: '/sigma', query: { datasource: selectedDatasource } })"/>
                    <q-btn disable flat icon="refresh" label="Sync datasources" @click="syncDatasources()"/>
                  </span>
                </div>
              </q-card-section>
              <q-card-section>
                <!-- <div class="row">
                  <div class="col q-pa-sm">
                    <q-input filled v-model="datasourceDetails.date_connected" mask="date" label="Connected date">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="datasourceDetails.date_connected" @input="() => $refs.qDateProxy.hide()" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div> -->
                <div class="row">
                  <div class="col q-pa-sm">
                    <q-editor v-model="datasourceDetails.comment" min-height="5rem" />
                  </div>
                </div>
                <div class="row">
                  <div class="col q-pa-sm">
                    <q-table title="Log sources" flat :data="datasourceDetails.products" :columns="columns" row-key="name">
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
import moment from 'moment'

export default {
  name: 'Coverage',
  data () {
    return {
      selectedDatasource: null,
      datasourceDetails: { },
      filterDatasource: '',
      datasourceProducts: [],
      config: {
      },
      datasourcePagination: {
        sortBy: 'desc',
        descending: false,
        rowsPerPage: 10,
        page: 1
      },
      datasourceColumns: [
        { name: 'name', label: 'Name', field: 'name', align: 'left' }
      ],
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
        filteredOptions.push({ name: datasource })
      })
      return filteredOptions
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
    }
  },
  methods: {
    syncDatasources () {
      this.$axios
        .post('/search/splunk/indices')
        .then(response => this.syncSplunkSuccess(response['data']))
    },
    syncSplunkSuccess (response) {
      var notification = {
        title: 'Datasource synchronisation',
        message: 'Issued task to find available datasources using Splunk',
        datetime: moment().format()
      }
      this.$store.commit('notifications/addNotification', notification)
    },
    deleteProductRow (row) {
      this.datasourceProducts = this.datasourceProducts.filter(e => !e.name.includes(row.name))
    },
    addProductRow () {
      this.datasourceDetails.products.push({
        name: 'New name',
        vendor: 'New vendor',
        source: 'New source',
        sourcetype: 'New sourcetype',
        index: 'New index'
      })
    },
    selectDatasource (datasource) {
      this.selectedDatasource = datasource
      this.getDatasourceDetails(datasource)
      var filterQuery = { datasource: datasource }
      if (JSON.stringify(this.$route.query) !== JSON.stringify(filterQuery)) {
        this.$router.replace({ path: '/coverage', query: filterQuery })
      }
    },
    getDatasourceDetails (datasource) {
      this.$axios
        .get('/products/coverage', { params: { datasource: datasource } })
        .then(response => this.getDatasourceDetailsSuccess(response['data']))
        .catch(response => this.getDatasourceDetailsFail(datasource))
    },
    getDatasourceDetailsSuccess (response) {
      this.datasourceDetails = response
    },
    getDatasourceDetailsFail (datasource) {
      this.datasourceDetails = {
        data_source_name: datasource,
        date_connected: null,
        available_for_data_analytics: false,
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
      }
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
      if (this.$route.query) {
        this.selectDatasource(this.$route.query.datasource)
      }
    },
    saveCoverage () {
      this.$axios
        .post('/mitre/coverage', this.datasourceDetails)
        .then(response => this.saveCoverageSuccess(response['data']))
    },
    saveCoverageSuccess (response) {
      // console.log(response)
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
          products: [
          ],
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

<style lang="scss">
.dsavailable {
  color: green;
}
.dsmissing {
  color: red;
}
</style>
