<template>
  <q-page>

    <q-dialog v-model="showSaveGraph">
      <q-card>
        <q-form @submit="saveGraph">
          <q-card-section>
            <q-input ref="scenario" lazy-rules v-model="campaignName" label="Scenario name" :rules="[ val => val && val.length > 0 || 'Scenario name is required']"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn type="submit" flat label="Save" color="primary"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showScheduleScenario">
      <q-card>
        <q-form @submit="scheduleCampaign">
          <q-card-section>
            <q-input ref="scenario" lazy-rules v-model="campaignName" label="Scenario name" :rules="[ val => val && val.length > 0 || 'Scenario name is required']"/>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancel" v-close-popup />
            <q-btn type="submit" flat label="Schedule" color="primary"/>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>

    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-3">
        <q-form @submit="addTask" class="q-gutter-md">
          <!-- Dynamic filters -->
          <div class="row q-mt-md">
            <div class="col">
              <q-card flat class="filter-row">
                <q-card-section>
                  <q-input ref="name" lazy-rules v-model="taskName" label="Name" :rules="[ val => val && val.length > 0 || 'Task name is required']"/>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col">
              <q-card flat class="filter-row">
                <q-card-section>
                  <q-select
                    v-model="selectedAgents"
                    use-input
                    ref="agents"
                    use-chips
                    multiple
                    :options="agentOptions"
                    lazy-rules
                    :rules="[ val => val && val.length > 0 || 'Select at least 1 agent']"
                    label="Agents"
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col">
              <q-card flat class="filter-row">
                <q-card-section>
                  <q-select
                    v-model="scheduleCondition"
                    use-input
                    :options="['after', 'immediate']" />
                    <q-select v-if="scheduleCondition != 'immediate'"
                    v-model="afterTasks"
                    use-input
                    :options="taskOptions"
                    label="Task"
                    use-chips
                    multiple
                  />
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-12">
              <q-card flat class="filter-row">
                <q-card-section>
                  <div>
                    <q-input flat v-model="schedulerDate">
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-date v-model="schedulerDate" mask="YYYY-MM-DD HH:mm" />
                          </q-popup-proxy>
                        </q-icon>
                      </template>

                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy transition-show="scale" transition-hide="scale">
                            <q-time v-model="schedulerDate" mask="YYYY-MM-DD HH:mm" format24h />
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="div">
            <div class="queue-toggle float-left">
              <q-checkbox v-model="clearCommands" label="Clear queue" />
            </div>
            <div class="submit-task float-right">
              <q-btn label="Add" type="submit" color="primary" :disabled="queuedCommands.length === 0"/>
            </div>
          </div>

        </q-form>
        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col">
        <div class="row">
          <div class="col q-pl-md">
            <q-card class="q-pl-md" flat>
              <div class="dag">
                <div class="dag-text" style="position: absolute; z-index: 100; padding: 20px;">
                  <div class="dag-text-title text-h5">
                    Campaign  <q-btn v-if="nodes.length > 0" flat icon="play_circle_outline" @click="showScheduleScenario = true" /> <q-btn v-if="nodes.length > 0" flat icon="save" @click="showSaveGraph = true" />
                  </div>
                  <div class="dag-text-message text-h7" v-if="nodes.length === 0 ">
                    No scenarios have been added to the campaign
                  </div>
                  <div class="dag-text-content text-h7 q-mt-md" v-if="nodes.length > 0 && selectedTask">
                    <table>
                      <tr>
                        <td>Name</td>
                        <td>{{ taskDetails.id }}<q-btn v-on:click="deleteTask()" dense unelevated icon="delete" size="sm"/></td>
                      </tr>
                      <tr>
                        <td>Time</td>
                        <td>{{ taskDetails.taskData.start_date }}</td>
                      </tr>
                      <tr>
                        <td>Agents</td>
                        <td>{{ taskDetails.taskData.agents.map(agent => agent.name).join(',') }}</td>
                      </tr>
                    </table>
                  </div>
                </div>
                <network :nodes="nodes" :edges="edges" :options="options"
                  :events="['select']"
                  @select='clickNode' ref="campaign_dag">
                </network>
              </div>
            </q-card>
          </div>
        </div>
        <div class="row q-mt-md">
          <div class="col q-pl-md">
            <q-card class="q-pl-md q-pt-md" flat>
              <q-timeline>
                <q-timeline-entry v-if="queuedCommands.length === 0">
                  <template v-slot:title>
                    No commands have been added to queue
                  </template>
                  <template v-slot:subtitle>
                    Command timeline will be displayed here when available
                  </template>
                </q-timeline-entry>
                <q-timeline-entry v-for="(command, index) in queuedCommands" v-bind:key="index">
                  <template v-slot:title>
                    ${{ command.module }}: {{ command.reference_name }} <q-btn v-on:click="removeFromQueue(command)" dense unelevated icon="delete" size="sm"/>
                  </template>
                  <template v-slot:subtitle>
                    {{ command.category }} / {{ command.kill_chain_phase }} / {{ command.technique_name }}
                  </template>
                  <div class="row">
                    <div class="col">
                      <vue-code-highlight class="language-bash">
{{ JSON.stringify(command.input) }}
                      </vue-code-highlight>
                    </div>
                  </div>
                </q-timeline-entry>
              </q-timeline>
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
import { Network } from 'vue-vis-network'
import { component as VueCodeHighlight } from 'vue-code-highlight'
import 'vue-code-highlight/themes/prism-okaidia.css'
import moment from 'moment'

export default {
  name: 'Campaign',
  components: {
    Network,
    VueCodeHighlight
  },
  data () {
    return {
      showScheduleScenario: false,
      showSaveGraph: false,
      campaignName: '',
      scheduleCondition: 'immediate',
      schedulerDate: moment().format('YYYY-MM-DD hh:mm'),
      afterTasks: [ ],
      taskName: null,
      taskSleep: 0,
      selectedTask: null,
      taskInput: '',
      clearCommands: true,
      options:
      {
        height: '400px',
        width: '100%',
        autoResize: true,
        layout: {
          hierarchical: {
            enabled: true,
            direction: 'LR',
            sortMethod: 'directed',
            parentCentralization: true
          }
        },
        physics: {
          enabled: true
        }
      }
    }
  },
  computed: {
    taskDetails: {
      get () {
        if (this.selectedTask) {
          return this.$store.state.scheduler.nodes.filter(node => node.id.includes(this.selectedTask.node))[0]
        } else {
          return null
        }
      }
    },
    queuedCommands: {
      get () {
        return this.$store.state.queue.commands
      }
    },
    selectedAgents: {
      set (agents) {
        this.$store.commit('scheduler/setAgents', agents)
      },
      get () {
        return this.$store.state.scheduler.agents
      }
    },
    nodes: {
      get () {
        return this.$store.state.scheduler.nodes
      }
    },
    edges: {
      get () {
        return this.$store.state.scheduler.edges
      }
    },
    tasks: {
      get () {
        return this.$store.getters['scheduler/getTasks']
      }
    },
    dependencies: {
      get () {
        return this.$store.getters['scheduler/getDependencies']
      }
    },
    taskOptions: {
      get () {
        return this.$store.getters['scheduler/taskOptions']
      }
    },
    agentOptions: {
      get () {
        return this.$store.getters['agents/agentOptions']
      }
    }
  },
  methods: {
    deleteTask () {
      if (this.selectedTask) {
        this.$store.commit('scheduler/deleteTask', this.selectedTask)
        this.selectedTask = null
      }
    },
    clickNode (event) {
      if (event.nodes.length > 0) {
        var nodeData = { 'node': event.nodes[0], 'edges': event.edges }
        this.selectedTask = nodeData
      }
    },
    saveGraph () {
      var graphData = {
        nodes: this.$store.getters['scheduler/getNodes'],
        edges: this.$store.getters['scheduler/getEdges'],
        name: this.campaignName
      }
      this.$axios
        .post('/graphs', graphData)
        .then(response => this.saveGraphSuccess(response['data']))
    },
    saveGraphSuccess (response) {
      console.log(response)
    },
    scheduleCampaign () {
      this.$refs.scenario.validate()
      console.log(this.tasks)
      this.showScheduleScenario = false
      var campaignData = {
        tasks: this.tasks,
        dependencies: this.dependencies,
        name: this.campaignName
      }
      this.$axios
        .post('/tasks', campaignData)
        .then(response => this.getListenerOptionsSuccess(response['data']))
    },
    scheduleCampaignSuccess (response) {
      console.log(response)
    },
    addTask () {
      // Validate form fields
      this.$refs.name.validate()
      this.$refs.agents.validate()

      // Create new node and add queued commands
      if (!this.nodes.some(node => node.id === this.taskName)) {
        this.$store.commit('scheduler/addNode', {
          id: this.taskName,
          label: this.taskName,
          shape: 'box',
          color: '#343a40',
          font: {
            color: 'white',
            size: 20
          },
          margin: 12,
          taskData: {
            name: this.taskName,
            commands: this.$store.state.queue.commands,
            agents: this.$store.getters['scheduler/getAgents'],
            start_date: this.schedulerDate,
            sleep: this.taskSleep
          }
        })

        // Create dependency between tasks
        this.afterTasks.forEach(task => {
          this.$store.commit('scheduler/addEdge', {
            from: task,
            to: this.taskName,
            arrows: 'to',
            color: '#343a40',
            width: 3,
            dependencyData: {
              source: task,
              destination: this.taskName
            }
          })
        })
        // Clear queue after adding a new task
        if (this.clearCommands) {
          this.$store.commit('queue/setCommands', [])
        }
      }
      this.$refs.campaign_dag.fit()
      this.$refs.campaign_dag.redraw()
      this.$refs.campaign_dag.fit()
    },
    addToQueue (technique) {
      technique.commands.forEach(command => {
        var randomArray = new Uint32Array(5)
        var randomId = window.crypto.getRandomValues(randomArray)[2]
        var commandOptions = {
          reference_name: technique.name,
          reference_id: technique._id,
          technique_name: technique.technique_name,
          kill_chain_phase: technique.kill_chain_phase,
          technique_id: technique.technique_id,
          integration: command.integration,
          module: command.module,
          name: command.name,
          input: command.input,
          sleep: command.sleep,
          rand: randomId
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

<style lang="scss">
.q-markdown--code, .q-markdown--code__inner {
  width: 100%;
  margin: 0;
}
</style>
