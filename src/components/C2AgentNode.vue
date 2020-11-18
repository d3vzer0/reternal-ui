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
        <!-- <q-btn flat round color="primary" icon="delete" @click="$emit('delete')" /> -->
      </q-card-actions>
    </q-card-section>
    <!-- <span @click="$emit('edit')">Edit</span> -->
    <!-- <span class="pull-right" @click="$emit('delete')">Delete</span> -->
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
      nodeInput: null
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
    getAgents () {
      this.$axios
        .get('/agents/' + this.nodeData.integration)
    },
    getAgentsSuccess (response) {
      this.agentOptions = response
    }
  },
  mounted () {
    this.$nextTick(() => {
      const id = this.$el.parentElement.parentElement.id
      this.nodeId = id
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
