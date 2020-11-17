<template>
  <q-card class="node-card" flat>
    <q-card-section horizontal v-if="nodeId">
      <q-item>
        <q-item-section avatar>
          <q-avatar class="node-icon">
            <q-avatar><img src="statics/empire_small.png"/></q-avatar>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{nodeData.integration}}: {{nodeData.name}}</q-item-label>
          <q-item-label caption lines="2">{{nodeData.description}}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn flat round color="primary" icon="desktop_windows" @click="getData()" />
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
        label="Module"
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
    <q-card-section>
      <q-input dense filled v-model="nodeInput" label="Input"></q-input>
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
      nodeId: null,
      dataNode: null,
      nodeInput: null,
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
  methods: {
    filterFn (val, update, abort) {
      update(() => {
        const needle = val.toLowerCase()
        this.moduleOptions = this.moduleDefaultOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
      })
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
    font-size: 2rem;
  }
}

</style>
