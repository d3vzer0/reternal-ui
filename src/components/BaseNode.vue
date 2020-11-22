<template>
  <q-card class="node-card" flat v-if="nodeId">
    <q-card-section horizontal>
      <q-item>
        <q-item-section avatar>
          <q-avatar class="node-icon">
            <q-icon v-if="nodeData.icon" :name="nodeData.icon" class="node-icon-content"/>
            <img v-else-if="nodeData.thumbnail" :src="nodeData.thumbnail">
            <q-icon v-else name="event"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{nodeData.integration}}: {{nodeData.name}}</q-item-label>
          <q-item-label caption lines="2">{{nodeData.description}}</q-item-label>
        </q-item-section>
      </q-item>
      <!-- <q-card-actions vertical class="justify-around q-px-md">
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
      </q-card-actions> -->
    </q-card-section>
    <q-card-section v-for="(arg, key) in nodeData.arguments" v-bind:key="key">
      <q-input v-model="arg.values"/>
      <!-- <q-select
        dense
        filled
        v-model="moduleSelected"
        use-input
        hide-selected
        fill-input
        input-debounce="0"
        :options="moduleOptions"
        @filter="filterFn"
        label="Module"
        >
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select> -->
    </q-card-section>
    <q-card-section>
      <!-- <q-input dense filled v-model="nodeInput" label="Input"></q-input> -->
    </q-card-section>
  </q-card>
</template>

<script>

export default {
  name: 'BaseNode',
  props: {
    name: String,
    graphObject: Object
  },
  data () {
    return {
      nodeId: null,
      dataNode: null,
      dataInputs: {
        agents: ''
      }
    }
  },
  computed: {
    nodeData () {
      const dataNode = this.graphObject.getNodeFromId(this.nodeId.slice(5)).data
      return dataNode
    }
  },
  sockets: {
  },
  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.moduleOptions = this.moduleDefaultOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
    },
    setInputs () {
      for (let key of Object.keys(this.nodeData.arguments)) {
        this.dataInputs[key] = ''
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      const id = this.$el.parentElement.parentElement.id
      this.nodeId = id
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
    font-size: 2rem;
  }
}

</style>
