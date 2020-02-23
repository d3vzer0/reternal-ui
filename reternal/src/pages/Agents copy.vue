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
          <div class="col q-pa-md">
            <div class="terminal">
              <div class="terminal-history q-pa-md">
                <vue-code-highlight language='bash'>
                  {{terminalHistory.join('\n')}}
                </vue-code-highlight>
              </div>
              <div class="terminal-current q-pa-md">
                <span class="terminal-prompt">{{ terminalPrompt }}</span>
                <span class="terminal-input"><input @keydown.tab.prevent="autoComplete" @keydown.enter.prevent="terminalAction" v-model="terminalInput" placeholder="Prrrt..."/></span>
              </div>
              <div class="terminal-suggestions q-pa-md">
                <span class="terminal-prompt">{{ terminalSuggestion }}</span>
              </div>
            </div>
             <!-- <q-chip v-for="suggestion in suggestionList" v-bind:key="suggestion">
               <q-avatar icon="label" color="primary" text-color="white"/>
                {{ splitSuggestion(suggestion) }}
            </q-chip> -->
          </div>
        </div>
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
                <div class="absolute-top">
                  <div class="text-left float-left">
                    <q-checkbox v-model="agentsSelected" dark :val="agent.id" color="teal"/>
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
import { component as VueCodeHighlight } from 'vue-code-highlight'
// import 'vue-code-highlight/themes/prism-okaidia.css'
import 'prism-es6/components/prism-bash'
import 'prism-es6/components/prism-python'
import yargsParser from 'yargs-parser'

export default {
  name: 'Agents',
  components: {
    VueCodeHighlight
  },
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
      suggestionList: [],
      agentOptions: [],
      agentDetails: {},
      // agentsSelected: [],
      agentDetailsColumns: [
        { name: 'key', align: 'left', field: 'key', label: 'Key' },
        { name: 'value', align: 'left', field: 'value', label: 'Value' }
      ],
      showAgentDetails: false,
      moduleList: {},
      terminalUser: 'root@reternal',
      terminalPath: '~',
      terminalInput: '',
      terminalHistory: [],
      terminalSuggestion: '',
      commandFunctions: {
      }
    }
  },
  created () {
    this.$getIntegrations()
    this.getAgents()
    this.getModules()
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
        console.log(agents)
        this.$store.commit('agents/setSelected', agents)
      }
    }
  },
  watch: {
    selectedPlatform: function (platform) {
      this.getTechniques()
    }
  },
  methods: {
    terminalAction (event) {
      const parsedInput = yargsParser(this.terminalInput)
      const command = parsedInput['_'][0]
      this.terminalHistory.push(`${this.terminalPrompt} ${this.terminalInput}`)
      this.terminalInput = ''
      if (!Object.keys(this.moduleList).includes(command)) {
        this.terminalHistory.push(`Command: ${command} not found`)
      } else {
        Object.entries(this.moduleList[command].options).forEach(([option, parameters]) => {
          if (!(option in parsedInput)) {
            parsedInput[option] = parameters.default
          }
          if (parameters.required === true && parsedInput[option] === '') {
            var moduleDesc = this.moduleList[command].description
            var stdOut = `\nDescription: \n ${moduleDesc} \n\n`
            Object.entries(this.moduleList[command].options).forEach(([key, value]) => {
              stdOut += `--${key} [required=${value['required']},default=${value['default']}]\n`
            })
            this.terminalHistory.push(stdOut)
          }
        })
      }
    },
    autoComplete () {
      this.terminalSuggestion = ''
      var totalMatches = new Set()
      for (var module of Object.keys(this.moduleList)) {
        var modCompare = module.substr(this.terminalInput.length, module.length)
        var modulePath = modCompare.split('/')
        if (module.startsWith(this.terminalInput)) {
          var autoComplete = this.terminalInput + modulePath[0]
          if (modulePath.length !== 1) {
            autoComplete += '/'
          }
          totalMatches.add(this.terminalInput + modulePath[0])
        }
      }

      if (totalMatches.size === 1) {
        this.terminalInput = autoComplete
      } else {
        // this.suggestionList = Array.from(totalMatches)
        var counter = 0
        for (var sug of Array.from(totalMatches)) {
          counter += 1
          this.terminalSuggestion += this.splitSuggestion(sug) + '\t\t'
          if (counter % 4 === 0) {
            this.terminalSuggestion += '\n'
          }
        }
      }
    },
    splitSuggestion (value) {
      var splitValue = value.split('/')
      return splitValue[splitValue.length - 1]
    },
    getModules () {
      this.$axios
        .get('modules/empire2')
        .then(response => this.getModulesSuccess(response['data']))
    },
    getModulesSuccess (modules) {
      this.moduleList = modules
      for (var module of Object.keys(modules)) {
        this.commandFunctions[module] = this.runCommand
      }
    },
    getAgents () {
      for (var integration in this.$store.state.integrations.integrationOptions) {
        this.$axios
          .get('/agents/' + integration)
          .then(response => this.getAgentsSuccess(response['data']))
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
