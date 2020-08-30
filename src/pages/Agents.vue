<template>
  <q-page>
    <!-- <error-message :error_message='error_response'></error-message> -->
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <!-- <div class="col-2">
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
      </div> -->
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col">
        <!-- <div class="row">
          <div class="col q-pa-md">
            <terminal></terminal>
          </div>
        </div> -->
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
          <div class="col-3 q-pa-md" v-if="agentOptions.length === 0">
            <div class='text-h6'>No agents running yet</div>
            <!-- <q-card flat class="agent-card">
              <q-card-section>
                <div class='text-h6'>No agents running yet</div>
              </q-card-section>
            </q-card> -->
          </div>
          <div class="col-3 q-pa-md" v-for="(agent, index) in agentOptions" v-bind:key="index">
            <q-card flat class="agent-card">
              <q-img :src="getThumbnail(agent.integration)" style="height: 140px">
                <div class="absolute-top">
                  <div class="text-left float-left">
                    <q-checkbox v-model="agentsSelected" dark :val="agent.id" color="teal"
                      @input="clickety(agent)"/>
                  </div>
                  <div class="float-right text-right text-h4">
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
                <q-btn flat icon="info" @click="agentDetails = agent, showAgentDetails = true" />
                <q-btn flat icon="stop" @click="stopAgent(agent)" />
                <q-btn flat icon="delete" @click="deleteAgent(agent)"/>
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
// import Terminal from 'components/Terminal'

export default {
  name: 'Agents',
  components: {
    // Terminal
  },
  data () {
    return {
      error_response: null,
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      selectedPlatform: 'Windows',
      selectedIntegration: '',
      searchTechnique: '',
      techniqueOptions: [],
      suggestionList: [],
      agentDetails: {},
      agentDetailsColumns: [
        { name: 'key', align: 'left', field: 'key', label: 'Key' },
        { name: 'value', align: 'left', field: 'value', label: 'Value' }
      ],
      showAgentDetails: false
    }
  },
  created () {
    this.$getIntegrations()
    this.getAgents()
  },
  sockets: {
    getAgents: function (response) {
      this.$axios
        .get(`/state/agents/get/${response.task}`)
        .then(response => this.getAgentsSuccess(response.data))
    },
    stopAgent: function (response) {
      this.getAgents()
    },
    deleteAgent: function (response) {
      this.getAgents()
    }
  },
  computed: {
    terminalPrompt () {
      return `[${this.terminalUser} ${this.terminalPath}]`
    },
    integrationOptions: {
      get () {
        const options = [
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
        return tableRows
      }
    },
    agentsSelected: {
      get () {
        return this.$store.state.agents.selected
      },
      set (agents) {
        this.$store.commit('agents/setSelected', agents)
      }
    },
    agentOptions: {
      set (agents) {
        this.$store.commit('agents/setOptions', agents)
      },
      get () {
        return this.$store.state.agents.options
      }
    }
  },
  watch: {
    selectedPlatform: function (platform) {
      this.getTechniques()
    }
  },
  methods: {
    stopAgent (agent) {
      this.$axios
        .get(`agents/${agent.integration}/${agent.name}/stop`)
    },
    deleteAgent (agent) {
      this.$axios
        .delete(`agents/${agent.integration}/${agent.name}`)
    },
    clickety (a) {
      console.log(a)
    },
    getAgents () {
      for (var integration in this.$store.state.integrations.integrationOptions) {
        this.$axios
          .get('/agents/' + integration)
      }
    },
    getAgentsSuccess (agents) {
      this.agentOptions = agents
    },
    getTechniquesSuccess (techniques) {
      this.techniqueOptions = techniques
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
