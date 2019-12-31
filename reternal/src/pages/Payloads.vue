<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md justify-center row">
      <!-- Results column -->
      <div class="col-8">
        <q-card class="q-pl-md q-pt-md" flat>
          <q-stepper v-model="step" ref="stepper" color="primary" animated >
            <q-step :name="1" title="Select C2 module" icon="settings" :done="step > 1">
              <q-list>
                <q-item tag="label" v-ripple>
                  <q-item-section avatar>
                    <q-radio v-model="color" color="teal" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Covenant C2</q-item-label>
                    <q-item-label caption>
                      Covenant is a .NET command and control framework that aims to highlight the attack surface of .NET, make the use of offensive .NET tradecraft easier, and serve as a collaborative command and control platform for red teamers.
Covenant is an ASP.NET Core, cross-platform application that includes a web-based interface that allows for multi-user collaboration.
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple disable :clickable="False">
                  <q-item-section avatar>
                    <q-radio v-model="color" color="empire2" disable />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Empire V2</q-item-label>
                    <q-item-label caption>
Empire is a post-exploitation framework that includes a pure-PowerShell2.0 Windows agent, and a pure Python 2.6/2.7 Linux/OS X agent. It is the merge of the previous PowerShell Empire and Python EmPyre projects. The framework offers cryptologically-secure communications and a flexible architecture. On the PowerShell side, Empire implements the ability to run PowerShell agents without needing powershell.exe, rapidly deployable post-exploitation modules ranging from key loggers to Mimikatz, and adaptable communications to evade network detection, all wrapped up in a usability-focused framework.                     </q-item-label>
                  </q-item-section>
                </q-item>
                <q-item tag="label" v-ripple disable :clickable="False">
                  <q-item-section avatar>
                    <q-radio v-model="color" color="empire3" disable />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>Empire V3</q-item-label>
                    <q-item-label caption>
                      Empire 3.0 is a post-exploitation framework that includes a pure-PowerShell 2.0 Windows agent, and compatibility with Python 2.x/3.x Linux/OS X agents. It is the merger of the previous PowerShell Empire and Python EmPyre projects. The framework offers cryptologically-secure communications and a flexible architecture. On the PowerShell side, Empire implements the ability to run PowerShell agents without needing powershell.exe, rapidly deployable post-exploitation modules ranging from key loggers to Mimikatz, and adaptable communications to evade network detection, all wrapped up in a usability-focused framework.
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-step>
            <q-step :name="2" title="Select campaign settings" icon="settings" :done="step > 2">
              For each ad campaign that you create, you can control how much you're willing to
              spend on clicks and conversions, which networks and geographical locations you want
              your ads to show on, and more.
            </q-step>
             <q-step :name="3" title="Select campaign settings" icon="settings" :done="step > 3">
              For each ad campaign that you create, you can control how much you're willing to
              spend on clicks and conversions, which networks and geographical locations you want
              your ads to show on, and more.
            </q-step>
            <template v-slot:navigation>
              <q-stepper-navigation>
                <q-btn @click="$refs.stepper.next()" color="primary" :label="step === 4 ? 'Finish' : 'Continue'" />
                <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />
              </q-stepper-navigation>
            </template>
          </q-stepper>
        </q-card>
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
  name: 'Queue',
  data () {
    return {
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      tab: null,
      color: null,
      step: 1,
      phaseStep: '',
      selectedPlatform: 'Windows',
      phaseOptions: [],
      phaseTechniques: {
      },
      selectedAgents: [],
      agentOptions: ['agent1', 'agent2'],
      selectedPhase: '',
      taskInput: ''
    }
  },
  created () {
  },
  watch: {
  },
  computed: {
    queuedCommands: {
      get () {
        return this.$store.state.queue.commands
      }
    }
  },
  methods: {
    addToQueue (technique) {
      technique.commands.forEach(command => {
        var randomArray = new Uint32Array(5)
        var randomId = window.crypto.getRandomValues(randomArray)[2]
        var commandOptions = {
          reference_name: technique.name,
          reference_id: technique._id['$oid'],
          technique_name: technique.technique_name,
          kill_chain_phase: technique.kill_chain_phase,
          technique_id: technique.technique_id,
          name: command.name,
          input: command.input,
          sleep: command.sleep,
          rand: randomId,
          type: command.type
        }
        this.$store.commit('queue/addCommand', commandOptions)
      })
    },
    removeFromQueue (technique) {
      this.$store.commit('queue/removeCommand', technique.rand)
    }
  }
}
</script>
