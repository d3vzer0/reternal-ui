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
                 <q-select
                  v-model="selectedAgents"
                  use-input
                  use-chips
                  multiple
                  :options="agentOptions"
                  label="Agents"
                />
                <!-- <q-option-group :options="platformOptions" label="Platform" type="radio" v-model="selectedPlatform" /> -->
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col">
        <div class="row q-mt-md">
          <div class="col q-pl-md">
            <q-card class="q-pl-md q-pt-md" flat>
              <q-timeline>
                <q-timeline-entry v-if="queuedCommands.length === 0">
                  <template v-slot:title>
                    No tasks added to task queue yet
                  </template>
                  <template v-slot:subtitle>
                    Tasks will be displayed here when available
                  </template>
                </q-timeline-entry>
                <q-timeline-entry v-for="(command, index) in queuedCommands" v-bind:key="index">
                  <template v-slot:title>
                    ${{ command.name }}: {{ command.reference_name }} <q-btn v-on:click="removeFromQueue(command)" dense unelevated icon="delete" size="sm"/>
                  </template>
                  <template v-slot:subtitle>
                    {{ command.type }} / {{ command.kill_chain_phase }} / {{ command.technique_name }}
                  </template>
                  <div class="row">
                    <div class="col">
                      <q-markdown>
```
{{ command.input }}
```
                      </q-markdown>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-badge><q-icon name="timer" /> {{ command.sleep }}s</q-badge>
                    </div>
                  </div>
                </q-timeline-entry>
              </q-timeline>
            </q-card>
             <q-card flat>
          <div class="row q-pa-md q-mt-md">
            <div class="col-2 q-mr-md">
              <q-select
                v-model="selectedAgents"
                use-input
                use-chips
                multiple
                :options="agentOptions"
                label="Command"
              />
            </div>
            <div class="col q-mr-md">
                <q-input v-model="taskInput" label="Input" />
            </div>
            <div class="col-1 q-mr-md">
                <q-input v-model="taskInput" label="Sleep" />
            </div>
            <div class="col-1 vertical-bottom">
                <q-btn class="float-right" unelevated icon="add_to_queue" size="lg" />
              <!-- <q-input v-model="taskInput" label="Standard" /> -->
            </div>
          </div>
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
  name: 'Queue',
  data () {
    return {
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      tab: null,
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
