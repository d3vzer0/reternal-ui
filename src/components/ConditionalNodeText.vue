<template>
  <q-card class="node-card" flat>
    <q-card-section horizontal v-if="nodeId">
      <q-item>
        <q-item-section avatar>
          <q-avatar class="node-icon">
            <q-icon name="spellcheck" class="node-icon-content"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ nodeData.name }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-actions vertical class="justify-around q-px-md">
        <q-btn v-if="nodeData.type === 'integration'" flat round color="primary" icon="desktop_windows" @click="getData()" />
        <!-- <q-btn flat round color="primary" icon="delete" @click="$emit('delete')" /> -->
      </q-card-actions>
    </q-card-section>
    <q-card-section>
      <q-input dense filled v-model="nodeInput" label="String"></q-input>
    </q-card-section>
    <!-- <span @click="$emit('edit')">Edit</span> -->
    <!-- <span class="pull-right" @click="$emit('delete')">Delete</span> -->
  </q-card>
</template>

<script>

export default {
  name: 'ConditionalNode',
  props: {
    name: String,
    graphObject: Object
  },
  data () {
    return {
      nodeId: null,
      dataNode: null,
      nodeInput: null
    }
  },
  computed: {
    nodeData () {
      console.log(this.nodeId)
      const dataNode = this.graphObject.getNodeFromId(this.nodeId.slice(5)).data
      console.log(dataNode)
      return dataNode
    }
  },
  methods: {
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
