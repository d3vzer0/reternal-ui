<template>
  <q-card class="node-card" flat>
    <q-card-section horizontal v-if="nodeId">
      <q-item>
        <q-item-section avatar>
          <q-avatar class="node-icon">
            <q-icon name="event" class="node-icon-content"/>
          </q-avatar>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ nodeData.name }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-card-actions vertical class="justify-around q-px-md">
      </q-card-actions>
    </q-card-section>
    <q-card-section>
      <q-input dense filled v-model="date" label="Date">
      <template v-slot:prepend>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="YYYY-MM-DD HH:mm">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>

      <template v-slot:append>
        <q-icon name="access_time" class="cursor-pointer">
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="date" mask="YYYY-MM-DD HH:mm" format24h>
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-time>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    </q-card-section>
  </q-card>
</template>

<script>

export default {
  name: 'ConditionalNodeDate',
  props: {
    name: String,
    graphObject: Object
  },
  data () {
    return {
      nodeId: null,
      dataNode: null,
      date: null
    }
  },
  computed: {
    nodeData () {
      const dataNode = this.graphObject.getNodeFromId(this.nodeId.slice(5)).data
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
    font-size: 1.5rem;
  }
}

</style>
