<template>
  <q-card class="node-card" flat>
    <q-card-section horizontal v-if="nodeId">
      <q-item>
        <q-item-section avatar>
          <q-avatar class="node-icon">
            <q-icon name="mdi-bullseye" class="node-icon-content"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ nodeData.name }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn flat round color="primary" icon="desktop_windows" @click="agentDialog = true, getAgents()" />
        <q-popup-edit v-model="agentDialog" :cover="false"
          :offset="[100, -140]">
          <q-select
            v-model="agentsSelected"
            multiple
            :options="agentOptions"
            option-value="id"
            option-label="name"
            use-chips
            style="width:200px"
            stack-label
            label="Select agents"
          />
      </q-popup-edit>
      </q-card-actions>
    </q-card-section>
    <q-card-section>
      <q-select
        dense
        filled
        v-model="moduleSelected"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="moduleOptions"
        @filter="filterFn"
        label="Technique"
        >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
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
      agentDialog: false,
      agentOptions: [],
      agentsSelected: [],
      nodeId: null,
      dataNode: null,
      moduleSelected: null,
      moduleFilter: null,
      moduleOptions: [],
      moduleDefaultOptions: []
    }
  },
  computed: {
    nodeData () {
      const dataNode = this.graphObject.getNodeFromId(this.nodeId.slice(5)).data
      return dataNode
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
    getModules () {
      this.$axios
        .get('/mapping/distinct', {
          params: { fields: 'name' }
        })
        .then(response => this.getModulesSuccess(response.data))
    },
    getModulesSuccess (modules) {
      this.moduleDefaultOptions = modules.name
    },
    getAgents () {
      // for (var integration in this.integrationOptions) {
      //   this.$axios
      //     .get('/agents/' + integration)
      // }
    },
    getAgentsSuccess (response) {
      this.agentOptions = response
    }
  },
  mounted () {
    this.$nextTick(() => {
      const id = this.$el.parentElement.parentElement.id
      this.nodeId = id
      this.getModules()
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

.node-card {
  height: 100%;
  .node-icon-content {
    font-size: 1.5rem;
  }
}

</style>
