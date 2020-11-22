<template>
  <q-card flat class="node-card" v-if="nodeId">
    <q-card-section horizontal class="node-content">
      <q-item class="node-title">
        <q-item-section avatar>
          <q-avatar class="node-icon">
            <q-icon v-if="nodeData.icon" :name="nodeData.icon" class="node-icon-content"/>
            <img v-else-if="nodeData.thumbnail" :src="nodeData.thumbnail">
            <q-icon v-else name="event"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ nodeData.label}}</q-item-label>
          <q-item-label caption lines="2">{{nodeData.description}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-actions vertical class="node-dropdown justify-around q-px-md ">
        <q-btn flat icon="keyboard_arrow_down" @click="argsVisible = !argsVisible"/>
      </q-card-actions>
    </q-card-section>
    <q-slide-transition>
      <div class="node-arguments" v-show="argsVisible">
        <q-card-section v-for="(arg, index) in nodeArguments" v-bind:key="index">
          <q-input dense v-if="arg.type === 'input'" v-model="arg.value" :label="arg.label"/>
          <q-select
            dense
            v-if="arg.type === 'modules'"
            v-model="arg.value"
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            :options="moduleOptions"
            @filter="filterFn"
            :label="arg.label"
            >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  No results
                </q-item-section>
              </q-item>
            </template>
          </q-select>
          <q-select
            v-if="arg.type === 'agents'"
            dense
            v-model="arg.value"
            multiple
            :options="agentOptions"
            option-value="id"
            option-label="name"
            use-chips
            stack-label
            :label="arg.label"
            />
        </q-card-section>
      </div>
    </q-slide-transition>
  </q-card>
</template>

<script>

export default {
  name: 'C2Node',
  props: {
    name: String,
    graphObject: Object
  },
  data () {
    return {
      nodeId: null,
      argsVisible: false,
      dataNode: null,
      nodeArguments: [],
      moduleFilter: null,
      moduleOptions: [],
      moduleSelected: null,
      moduleDefaultOptions: [],
      agentDialog: false,
      agentOptions: [],
      agentsSelected: []
    }
  },
  computed: {
    nodeData () {
      const dataNode = this.graphObject.getNodeFromId(this.nodeId.slice(5)).data
      return dataNode
    },
    nodeIcon () {
      return (this.nodeData.icon) ? this.nodeData.icon : (this.nodeData.thumbnail) ? `img:${this.nodeData.thumbnail}` : 'event'
    }
  },
  sockets: {
    getAgents: function (response) {
      this.$axios
        .get(`/state/agents/get/${response.task}`)
        .then(response => this.getAgentsSuccess(response.data))
    }
  },
  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.moduleOptions = this.moduleDefaultOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    setInputs () {
      for (let [name, options] of Object.entries(this.nodeData.arguments)) {
        var argData = {
          label: options.label,
          description: options.description,
          name: name,
          type: options.form
        }
        if ('multi' in options) {
          argData.value = []
        } else {
          argData.value = null
        }
        this.nodeArguments.push(argData)
      }
    },
    getAgents () {
      this.$axios
        .get('/agents/' + this.nodeData.integration)
    },
    getAgentsSuccess (response) {
      this.agentOptions = response
    },
    getModules () {
      this.$axios
        .get(`modules/${this.nodeData.integration}`)
        .then(response => this.getModulesSuccess(response['data']))
    },
    getModulesSuccess (modules) {
      for (var module of Object.keys(modules)) {
        this.moduleDefaultOptions.push(module)
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      const id = this.$el.parentElement.parentElement.id
      this.nodeId = id
      this.getAgents()
      this.getModules()
      this.setInputs()
    })
  }
}

</script>
<style lang="scss">

.body--light {
  .node-icon {
    background-color: $primary;
    color: #f5f5f5;
  }
  .node-title {
    color: $primary;
  }
}

.body--dark {
  .node-icon {
    background-color: #f5f5f5;
    color: $primary;
  }
}

.example-node {
  padding: 5px;
}
.pull-right {
  float: right;
}

.node-content {
  z-index: 1;
  color: $primary;
}

.node-dropdown {
  margin-left: 20px;
}

.node-arguments {
  position: absolute;
  background-color: white;
  width: 100%;
  z-index: -1;
}

.node-card {
  border-radius: 0px;
  height: 100%;
  .node-icon-content {
    font-size: 2rem;
  }
}

</style>
