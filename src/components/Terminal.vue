<template>
  <div class="terminal">
    <q-scroll-area style="height: 200px;" ref="terminalArea">

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
    </q-scroll-area>
  </div>
</template>

<script>
import { component as VueCodeHighlight } from 'vue-code-highlight'
import 'prism-es6/components/prism-bash'
import 'prism-es6/components/prism-python'
import yargsParser from 'yargs-parser'

export default {
  name: 'Terminal',
  components: {
    VueCodeHighlight
  },
  data () {
    return {
      selectedIntegration: '',
      suggestionList: [],
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
    this.getModules()
  },
  computed: {
    terminalPrompt () {
      return `[${this.terminalUser} ${this.terminalPath}]`
    },
    agentsSelected: {
      get () {
        return this.$store.state.agents.selected
      }
    }
  },
  watch: {
  },
  methods: {
    terminalAction (event) {
      const parsedInput = yargsParser(this.terminalInput)
      const command = parsedInput['_'][0]
      this.terminalHistory.push(`${this.terminalPrompt} ${this.terminalInput}`)
      this.terminalInput = ''
      if (command === 'shell') {
        console.log('nou')
      } else if (!Object.keys(this.moduleList).includes(command)) {
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
      console.log(this.agentsSelected)
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
    getTechniquesSuccess (techniques) {
      this.techniqueOptions = techniques
    }
    // runShell (input) {x
    // },
    // runModule (module, input) {
    // }
  }
}
</script>
