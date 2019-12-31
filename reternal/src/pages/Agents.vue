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
                <q-input v-model="searchTechnique" label="Name " />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-option-group :options="integrationOptions" label="Platform" type="radio" v-model="selectedIntegration" />
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
          <q-dialog v-model="showAgentDetails">
            <q-card v-if="showAgentDetails" style="min-width: 700px;">
              <q-card-section>
                <div class="text-h6">{{ agentDetails.integration }}: {{ agentDetails.name }}</div>
              </q-card-section>

              <q-card-section>
                <q-table flat
                  title="Details"
                  :data="agentDetailsRows"
                  :columns="agentDetailsColumns"
                />
              </q-card-section>

              <q-card-actions align="right">
                <q-btn flat label="OK" color="primary" v-close-popup />
              </q-card-actions>
            </q-card>
          </q-dialog>

          <div class="col-3 q-pa-md" v-for="(agent, index) in agentOptions" v-bind:key="index">
            <q-card flat class="my-card">
              <q-img :src="getThumbnail(agent.integration)" style="height: 140px">
                <div class="absolute-top text-right">
                  <div class="text-h4">
                    <q-icon name="fab fa-apple" v-if="agent.operating_system === 'macOS'"/>
                    <q-icon name="fab fa-linux" v-if="agent.operating_system === 'Linux'"/>
                  </div>
                </div>
                <div class="absolute-bottom text-left">
                  <div class="text-h6">
                    {{ agent.name }}
                  </div>
                   <div class="text-h9">
                    {{ agent.integration }}
                  </div>
                </div>
              </q-img>

              <q-separator />
              <q-card-actions align="around">
                <q-btn flat icon="stop"  />
                <q-btn flat icon="history" />
                <q-btn flat icon="info" @click="agentDetails = agent, showAgentDetails = true" />
              </q-card-actions>
              <q-separator />
              <q-card-section>
                <q-list>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="person" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ agent.username }}</q-item-label>
                      <q-item-label caption>{{ agent.hostname }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="settings_ethernet" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ agent.external_ip }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="access_time" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ agent.last_checkin }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- <q-item>
                    <q-item-section avatar>
                      <q-icon color="primary" name="wifi" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label><q-badge color="negative" label="Offline" /></q-item-label>
                      <q-item-label caption>Unable to connect</q-item-label>
                    </q-item-section>
                  </q-item> -->
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
import VueMasonry from 'vue-masonry-css'
import Vue from 'vue'
Vue.use(VueMasonry)

export default {
  name: 'Agents',
  data () {
    return {
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      selectedPlatform: 'Windows',
      selectedIntegration: '',
      searchTechnique: '',
      techniqueOptions: [],
      agentOptions: [],
      agentDetails: {},
      agentDetailsColumns: [
        { name: 'key', align: 'left', field: 'key', label: 'Key' },
        { name: 'value', align: 'left', field: 'value', label: 'Value' }
      ],
      showAgentDetails: false
    }
  },
  created () {
    this.getAgents()
  },
  computed: {
    integrationOptions: {
      get () {
        const options = [
          { 'value': '', 'label': 'Any' }
        ]
        for (var integration in this.$store.state.integrations.integrationOptions) {
          options.push({ 'value': integration, 'label': integration })
        }
        return options
      }
    },
    agentDetailsRows: {
      get () {
        var tableRows = []
        for (const [key, value] of Object.entries(this.agentDetails)) {
          tableRows.push({ 'key': key, 'value': value })
        }
        console.log(tableRows)
        return tableRows
      }
    }
  },
  watch: {
    selectedPlatform: function (platform) {
      this.getTechniques()
    }
  },
  methods: {
    getAgents () {
      for (var integration in this.$store.state.integrations.integrationOptions) {
        this.$axios
          .get('/agents', { params: { 'integration': integration } })
          .then(response => this.getAgentsSuccess(response['data']))
      }
    },
    getAgentsSuccess (agents) {
      this.agentOptions = agents
    },
    getTechniquesSuccess (techniques) {
      this.techniqueOptions = techniques
      // techniques.forEach(technique => {
      //   this.techniqueOptions.push(technique)
      // })
    },
    getThumbnail (integration) {
      var thumbnail = '/statics/haha_php.jpeg'
      if (this.$store.state.integrations.integrationOptions[integration].thumbnail) {
        thumbnail = this.$store.state.integrations.integrationOptions[integration].thumbnail
      }
      return thumbnail
    }
  }
}
</script>
