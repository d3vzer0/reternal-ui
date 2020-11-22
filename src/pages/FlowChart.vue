<template>
  <q-page>
    <div class="q-pa-md row">
      <div class="col-md-3 col-xl-2 col-sm-4 col-xs-4 filter-col">
        <div class="row">
          <div class="col">
            <q-card flat id="node-tasks">
              <q-list>
                <q-item>
                  <div class="row" style="width: 100%;">
                    <div class="col">
                      <q-form ref="graphForm">
                        <q-input :rules="[val => !!val || 'Name is required']" v-model="campaignName" ref="flowchartName" label="Name" borderless dense></q-input>
                      </q-form>
                    </div>
                  </div>
                </q-item>
                <q-separator />
                <q-item-label header>Nodes</q-item-label>
                <q-item draggable="true" v-on:dragend="dragNodeEnd(cond)" clickable v-ripple v-for="(cond, index) in nodeOptions" v-bind:key="index">
                  <q-item-section avatar>
                    <q-avatar class="node-icon">
                      <q-icon v-if="cond.icon" :name="cond.icon" class="node-icon-content"/>
                      <img v-else-if="cond.thumbnail" :src="cond.thumbnail">
                      <q-icon v-else name="event"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{cond.label}}</q-item-label>
                    <q-item-label caption lines="2">{{cond.description}}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>
      <div class="col">
        <div class="inner-graph">
          <div class="graph-actions">
            <span class="run-graph"><q-btn flat class="node-icon" unelevated round icon="play_arrow" @click="getAvailableNodes()" /></span>
            <span class="save-graph"><q-btn flat class="node-icon" unelevated round icon="get_app" @click="exportFlowchart"/></span>
          </div>
          <div id="drawflow" v-on:dragover="dragNode">
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
/* eslint-disable */
import styleDrawflow from 'drawflow/dist/drawflow.min.css' // eslint-disable-line no-use-before-define
/* eslint-enable */

import Vue from 'vue'
import Drawflow from 'drawflow'
import C2Node from 'components/C2Node'
import BaseNode from 'components/BaseNode'

Vue.component('C2Node', C2Node)
Vue.component('BaseNode', BaseNode)

export default {
  name: 'DAG',
  components: {
  },
  data () {
    return {
      nodeOptions: [],
      campaignName: null,
      baseNodeX: 100,
      baseNodeY: 200,
      draggedNode: null,
      draggedNodePos: null,
      graphOptions: {
      },
      editor: null,
      filterTask: null,
      defaultNode: 'C2Node'
    }
  },
  computed: {
  },
  sockets: {
    getNodes: function (data) {
      this.$axios
        .get(`/state/nodes/get/${data.task}`)
        .then(response => this.getAvailableNodesResults(response.data))
    }
  },
  mounted () {
    const id = document.getElementById('drawflow')
    this.editor = new Drawflow(id, Vue)
    this.editor.start()
    var props = { graphObject: this.editor }
    this.editor.registerNode('C2Node', C2Node, props, this.graphOptions)
    this.editor.registerNode('BaseNode', BaseNode, props, this.graphOptions)
    this.getAvailableNodes()
  },
  created () {
  },
  methods: {
    dragNodeEnd (nodeContent) {
      // Calculate posX to place node on canvas
      const posX = this.draggedNodePos.clientX * (this.editor.precanvas.clientWidth /
        (this.editor.precanvas.clientWidth * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().x *
        (this.editor.precanvas.clientWidth / (this.editor.precanvas.clientWidth * this.editor.zoom)))

      // Calculate posY to place not on canvas
      const posY = this.draggedNodePos.clientY * (this.editor.precanvas.clientHeight /
        (this.editor.precanvas.clientHeight * this.editor.zoom)) - (this.editor.precanvas.getBoundingClientRect().y *
        (this.editor.precanvas.clientHeight / (this.editor.precanvas.clientHeight * this.editor.zoom)))

      this.addNode(nodeContent, posX, posY)
    },
    dragNode (event) {
      this.draggedNodePos = { clientX: event.clientX, clientY: event.clientY }
    },
    addNode (nodeData, posX, posY) {
      var randomArray = new Uint32Array(5)
      var randomId = window.crypto.getRandomValues(randomArray)[2]
      this.editor.addNode(randomId, nodeData.inputs, nodeData.outputs, posX, posY, 'nodeClass', nodeData, 'C2Node', 'vue')
    },
    exportFlowchart () {
      this.$refs.graphForm.validate().then(success => {
        if (success) {
          var downloadUrl = window.URL.createObjectURL(new Blob([JSON.stringify(this.editor.export())]))
          var downloadLink = document.createElement('a')
          downloadLink.href = downloadUrl
          downloadLink.setAttribute('download', 'flowchart.json')
          document.body.appendChild(downloadLink)
          downloadLink.click()
        }
      })
    },
    getAvailableNodes () {
      this.$axios
        .get('nodes')
    },
    getAvailableNodesResults (response) {
      console.log(response)
      this.nodeOptions = response
    },
    nodeDelete (node) {
      console.log(node)
    }
  }
}
</script>

<style lang="scss">
.body--light {
  .drawflow .drawflow-node {
    background: $primary;
    color: #f5f5f5;
  }
  .drawflow .drawflow-node:hover {
    background: $primary;
    color: #f5f5f5;
  }

  .drawflow .drawflow-node.selected {
    background: $primary;
    color: #f5f5f5;
  }

  .node-icon {
    background-color: $primary;
    color: #f5f5f5;
  }
}

.body--dark {
  .drawflow .drawflow-node {
    background: #f5f5f5;
    color: $primary;
  }
  .node-icon {
    background-color: #f5f5f5;
    color: $primary;
  }
}

.inner-graph {
  background-size: 20px 20px;
  background-image:
    linear-gradient(to right, rgba(186, 186, 186, 0.5) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(186, 186, 186, 0.5) 1px, transparent 1px);

  .graph-actions {
    position: absolute;
    padding-left: 20px;
    padding-top: 20px;
    right: 30px;
    z-index: 99;
    .save-graph {
      padding-left: 20px;
    }
  }
}

.node-icon-content {
  font-size: 1.5rem;
}

#drawflow {
  width: 100%;
  height: 900px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align:initial;
  position: relative;
}

.drawflow .drawflow-node {
  padding: 0px;
  width: 350px;
  border-radius: 0px;
  .node-arguments {
    margin-top: -2px;
    outline: 2px solid $primary;
  }
}

.drawflow .drawflow-node.selected  {
  background: white;
  border: 2px solid #4ea9ff;
  .node-arguments {
    margin-top: -2px;
    outline: 2px solid #4ea9ff;
  }
}

.drawflow .connection .main-path {
  stroke: #4ea9ff;
  stroke-width: 3px;
}

.drawflow .drawflow-node .input, .drawflow .drawflow-node .output {
  height: 15px;
  width: 15px;
  border: 2px solid $primary;
}

.drawflow .drawflow-node .input:hover, .drawflow .drawflow-node .output:hover {
  background: #4ea9ff;
}

.drawflow .drawflow-node .output {
  right: 8px;
}

.drawflow .drawflow-node .input {
  left: -8px;
  background: white;
}

.drawflow > .drawflow-delete {
  border: 2px solid #43b993;
  background: white;
  color: #43b993;
  -webkit-box-shadow: 0 2px 10px 2px $primary;
  box-shadow: 0 2px 10px 2px #43b993;
}

.drawflow-delete {
  border: 2px solid #4ea9ff;
  background: white;
  color: #4ea9ff;
  -webkit-box-shadow: 0 2px 20px 2px $primary;
  box-shadow: 0 2px 20px 2px $primary;
}
</style>
