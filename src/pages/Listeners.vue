<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-3 q-mr-md">
        <!-- Dynamic filters -->
        <div class="row q-mb-md">
          <div class="col">
            <C2ModulesActive></C2ModulesActive>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-option-group :options="integrationOptions" label="Platform" type="radio" v-model="selectedIntegration" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col">
        <q-slide-transition>
          <div class="row" v-show="showCreateListener">
            <div class="col-12 q-mb-md">
              <q-card flat>
                <q-card-section>
                  <q-stepper v-model="step" ref="stepper" color="primary" animated flat v-if="listenerOptions">
                    <q-step :name="1" title="Choose listener type" icon="settings" :done="step > 1" :disable="!selectedIntegration">
                      <q-list>
                        <q-item tag="label" v-ripple v-for="(value, index) in listenerOptions" v-bind:key="index">
                          <q-item-section avatar>
                            <q-radio v-model="listenerSelected" :val="value" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>{{ value }}</q-item-label>
                            <q-item-label caption>
                              {{ listenerSettings[value].description}}
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-step>
                    <q-step :name="2" title="Set listener options" icon="settings" :done="step > 2">
                      <q-form class="q-gutter-sm" v-if="listenerSelected">
                        <q-input v-for="(settings, listener) in listenerSettings[listenerSelected]['options']" v-bind:key="listener"
                          :label="listener"
                          v-model="settings.default"
                          :hint="settings.description"
                          :error="isRequired(settings.default, settings)"
                          filled
                          />
                      </q-form>
                    </q-step>
                    <q-step :name="3" title="Confirm" icon="settings" :done="step > 3">
                      Confirm creation for listener <br/>
                      <!-- <q-linear-progress dark rounded indeterminate class="q-mt-sm" v-show="inProgress" /> -->
                    </q-step>
                    <template v-slot:navigation>
                      <q-stepper-navigation v-if="listenerSelected">
                        <q-btn :disabled="forgotRequired" @click="createListener()" color="primary" label="Create" v-if="step === 3"/>
                        <q-btn @click="$refs.stepper.next()" color="primary" label="Next" v-else/>
                        <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
                      </q-stepper-navigation>
                    </template>
                  </q-stepper>
                  <q-inner-loading :showing="listenerStarting">
                    <q-spinner size="5em" color="teal" />
                  </q-inner-loading>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-slide-transition>
        <div class="row">
          <div class="col-12">
            <q-card flat class="my-card">
              <q-card-section>
                <q-table
                  title="Listeners"
                  :data="listenersActive"
                  :columns="listenersColumns"
                  row-key="name"
                  flat >
                  <template v-slot:top="props">
                    <div class="col-2 q-table__title">Active listeners</div>
                    <q-space />
                  </template>
                  <template v-slot:body="props">
                    <q-tr :props="props">
                      <q-td key="id" :props="props">
                       <q-btn class="float-left" dense round unelevated color="primary" size="sm" :icon="props.expand ? 'arrow_drop_up' : 'arrow_drop_down'" @click="props.expand = !props.expand" /> {{ props.row.id }}
                      </q-td>
                      <q-td key="name" :props="props">{{ props.row.name }}</q-td>
                      <q-td key="listener_type" :props="props">{{ props.row.listener_type }}</q-td>
                      <q-td key="integration" :props="props">{{ props.row.integration }}</q-td>
                      <q-td key="delete"> <q-btn class="float-right" dense round unelevated flat icon="delete_forever" @click="deleteListener(props.row.name)"/> </q-td>
                    </q-tr>
                    <q-tr v-show="props.expand" :props="props">
                      <q-td colspan="100%">
                        <div class="text-left">
                          <q-form
                            class="q-gutter-md" >
                            <q-input v-for="(settings, listener) in props.row.options" v-bind:key="listener"
                              :label="listener"
                              readonly
                              v-model="props.row.options[listener]"
                              filled />
                          </q-form>
                        </div>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
                <q-inner-loading :showing="listenerStopping">
                  <q-spinner size="5em" color="teal" />
                </q-inner-loading>
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
import C2ModulesActive from 'components/C2Modules'

export default {
  name: 'Listeners',
  components: {
    C2ModulesActive
  },
  computed: {
    forgotRequired: {
      get () {
        var forgot = false
        const relatedListener = this.listenerSettings[this.listenerSelected]['options']
        Object.keys(relatedListener).forEach(function (key) {
          if (relatedListener[key].default === '' && relatedListener[key].required) {
            forgot = true
          }
        })
        return forgot
      }
    },
    integrationOptions: {
      get () {
        const options = [
        ]
        for (const [key, value] of Object.entries(this.$store.state.integrations.integrationOptions)) {
          options.push({ 'value': key, 'label': key, 'disable': !value.enabled })
        }
        return options
      }
    }
  },
  data () {
    return {
      listenerStarting: false,
      listenerStopping: false,
      selectedIntegration: null,
      listenerOptions: [],
      listenerSettings: {},
      listenerSelected: '',
      listenersActive: [],
      listenersColumns: [
        { label: 'ID', field: 'id', name: 'id' },
        { label: 'Name', field: 'name', name: 'name' },
        { label: 'Listener Type', field: 'listener_type', name: 'listener_type' },
        { label: 'Integration', field: 'integration', name: 'integration' },
        { label: 'Delete', field: 'delete' }
      ],
      newListenerName: '',
      showCreateListener: true,
      step: 1
    }
  },
  created () {
    this.$getIntegrations()
  },
  sockets: {
    getListeners: function (response) {
      this.$axios
        .get(`/state/listeners/get/${response.task}`)
        .then(response => this.getListenersSuccess(response.data))
    },
    getListenerOptions: function (response) {
      this.$axios
        .get(`/state/listeneroptions/get/${response.task}`)
        .then(response => this.getListenerOptionsSuccess(response.data))
    },
    createListener: function (response) {
      this.listenerStarting = false
      this.getListeners()
    },
    deleteListener: function (response) {
      this.listenerStopping = false
      this.getListeners()
    }
  },
  watch: {
    selectedIntegration: function (integration) {
      this.getListenerOptions()
      this.getListeners()
    }
  },
  methods: {
    isRequired (value, options) {
      return value === '' && options.required
    },
    getListenerOptions () {
      this.$axios
        .get('/listeneroptions/' + this.selectedIntegration)
    },
    deleteListener (listener) {
      this.listenerStopping = true
      this.$axios
        .delete(`/listener/${this.selectedIntegration}/${listener}`)
    },
    getListenerOptionsSuccess (listeners) {
      this.listenerOptions = Object.keys(listeners)
      this.listenerSettings = listeners
    },
    getListeners () {
      this.$axios
        .get('/listeners/' + this.selectedIntegration)
    },
    getListenersSuccess (listeners) {
      this.listenersActive = listeners
    },
    createListener () {
      var postData = {}
      const relatedListener = this.listenerSettings[this.listenerSelected]['options']
      Object.keys(relatedListener).forEach(function (key) {
        if (relatedListener[key]['default'] !== '') {
          postData[key] = relatedListener[key]['default']
        }
      })
      this.listenerStarting = true
      this.$axios
        .post(`/listeners/${this.selectedIntegration}/${this.listenerSelected}`, postData)
    }
  }
}
</script>
