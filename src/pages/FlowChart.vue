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
                <q-item-label header>Conditionals</q-item-label>
                <q-item draggable="true" v-on:dragend="dragNodeEnd(cond)" clickable v-ripple v-for="(cond, index) in availableConditions" v-bind:key="'cond-' + index">
                  <q-item-section avatar>
                    <q-avatar class="node-icon">
                      <q-icon :name="cond.icon" class="node-icon-content"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{cond.name}}</q-item-label>
                    <q-item-label caption lines="2">{{cond.description}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </q-list>
               <q-list>
                <q-separator />
                <q-item-label header>Global</q-item-label>
                <q-item draggable="true" v-on:dragend="dragNodeEnd(cond)" clickable v-ripple v-for="(cond, index) in availableGlobalModules" v-bind:key="'glb-' + index">
                  <q-item-section avatar>
                    <q-avatar class="node-icon">
                      <q-icon :name="cond.icon" class="node-icon-content"/>
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{cond.name}}</q-item-label>
                    <q-item-label caption lines="2">{{cond.description}}</q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator />
              </q-list>
              <q-list>
                <q-item-label header>C2 Integrations</q-item-label>
                <q-item draggable="true" v-on:dragend="dragNodeEnd(mod)" clickable v-ripple v-for="(mod, index) in availableModules" v-bind:key="'mod-' + index">
                  <q-item-section avatar>
                    <q-avatar><img src="statics/empire_small.png"/></q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{mod.integration}}: {{mod.name}}</q-item-label>
                    <q-item-label caption lines="2">{{mod.description}}</q-item-label>
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
            <span class="run-graph"><q-btn flat class="node-icon" unelevated round icon="play_arrow" /></span>
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
import ConditionalNodeText from 'components/ConditionalNodeText'
import ConditionalNodeDate from 'components/ConditionalNodeDate'
import TechniqueNode from 'components/TechniqueNode'
import C2ModuleNode from 'components/C2ModuleNode'
import C2AgentNode from 'components/C2AgentNode'

Vue.component('ConditionalNodeText', ConditionalNodeText)
Vue.component('ConditionalNodeDate', ConditionalNodeDate)
Vue.component('TechniqueNode', TechniqueNode)
Vue.component('C2ModuleNode', C2ModuleNode)
Vue.component('C2AgentNode', C2AgentNode)

export default {
  name: 'DAG',
  components: {
  },
  data () {
    return {
      campaignName: null,
      baseNodeX: 100,
      baseNodeY: 200,
      draggedNode: null,
      draggedNodePos: null,
      graphOptions: {
      },
      editor: null,
      filterTask: null,
      availableModules: [
      ],
      availableGlobalModules: [
        {
          node: 'TechniqueNode',
          name: 'Run technique',
          icon: 'mdi-bullseye',
          module: 'execTechnique',
          integrations: this.integrationOptions,
          description: 'Run commands mapped to ATTCK techniques',
          type: 'technique',
          config: {
            inputs: 1,
            outputs: 1
          }
        }
      ],
      availableConditions: [
        {
          node: 'ConditionalNode',
          name: 'Result Contains',
          icon: 'spellcheck',
          module: 'ifCommandContainsString',
          description: 'Continue to next task if results from previous stage contains string',
          type: 'conditional',
          config: {
            inputs: 1,
            outputs: 2
          }
        },
        {
          node: 'ConditionalNodeDate',
          name: 'From Date',
          icon: 'event',
          module: 'ifDateExceeds',
          description: 'Continue to next task after specified datetime',
          type: 'conditional',
          config: {
            inputs: 1,
            outputs: 1
          }
        }
      ]
    }
  },
  computed: {
    integrationOptions: {
      get () {
        return this.$store.state.integrations.integrationOptions
      }
    }
  },
  sockets: {
    getWorkersC2: function (data) {
      this.$getIntegrationsResults(data.task)
      this.populateModules()
    }
  },
  mounted () {
    const id = document.getElementById('drawflow')
    this.editor = new Drawflow(id, Vue)
    this.editor.start()
    var props = { graphObject: this.editor }
    this.editor.registerNode('ConditionalNode', ConditionalNodeText, props, this.graphOptions)
    this.editor.registerNode('ConditionalNodeDate', ConditionalNodeDate, props, this.graphOptions)
    this.editor.registerNode('TechniqueNode', TechniqueNode, props, this.graphOptions)
    this.editor.registerNode('C2ModuleNode', C2ModuleNode, props, this.graphOptions)
    this.editor.registerNode('C2AgentNode', C2AgentNode, props, this.graphOptions)
    this.$getIntegrations()
    this.addBaseNode()
  },
  created () {
  },
  methods: {
    populateModules () {
      for (const [key, value] of Object.entries(this.integrationOptions)) {
        var moduleNode = {
          node: 'C2ModuleNode',
          integration: key,
          name: 'Run module',
          img: '/statics/empire_small.png',
          module: value.name,
          description: 'Run a C2 module on specified agent(s)',
          type: 'c2',
          config: {
            inputs: 1,
            outputs: 1
          }
        }
        this.availableModules.push(moduleNode)

        var agentNode = {
          node: 'C2AgentNode',
          integration: key,
          name: 'Stop agent',
          img: '/statics/empire_small.png',
          description: 'Stop/Kill specified agent(s)',
          type: 'c2',
          config: {
            inputs: 1,
            outputs: 1
          }
        }
        this.availableModules.push(agentNode)
      }
    },
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
    addBaseNode () {
      const baseNode = {
        node: 'ConditionalNodeDate',
        name: 'From Date',
        icon: 'event',
        module: 'ifDateExceeds',
        description: 'Continue to next task after specified datetime',
        type: 'conditional',
        config: {
          inputs: 0,
          outputs: 1
        }
      }
      this.addNode(baseNode, this.baseNodeX, this.baseNodeY)
    },
    addNode (nodeData, posX, posY) {
      var randomArray = new Uint32Array(5)
      var randomId = window.crypto.getRandomValues(randomArray)[2]
      this.editor.addNode(randomId, nodeData.config.inputs, nodeData.config.outputs, posX, posY, 'nodeClass', nodeData, nodeData.node, 'vue')
    },
    exportFlowchart () {
      this.$refs.graphForm.validate().then(success => {
        if (success) {
          var downloadUrl = window.URL.createObjectURL(new Blob([this.editor.export()]))
          var downloadLink = document.createElement('a')
          downloadLink.href = downloadUrl
          downloadLink.setAttribute('download', 'flowchart.json')
          document.body.appendChild(downloadLink)
          downloadLink.click()
        }
      })
    },
    nodeDelete (node) {
      console.log(node)
    }
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

:root {
  --dfBackgroundColor: null;
  --dfBackgroundSize: 0px;
  --dfBackgroundImage: none;

  --dfNodeType: flex;
  --dfNodeTypeFloat: none;
  --dfNodeBackgroundColor: #ffffff;
  --dfNodeTextColor: #000000;
  --dfNodeBorderSize: 1px;
  --dfNodeBorderColor: #000000;
  --dfNodeBorderRadius: 4px;
  --dfNodeMinHeight: 40px;
  --dfNodeMinWidth: 100px;
  --dfNodePaddingTop: 0px;
  --dfNodePaddingBottom: 0px;
  --dfNodeBoxShadowHL: 0px;
  --dfNodeBoxShadowVL: 2px;
  --dfNodeBoxShadowBR: 0px;
  --dfNodeBoxShadowS: 0px;
  --dfNodeBoxShadowColor: rgba(184, 184, 184, 1);

  --dfNodeHoverBackgroundColor: #ffffff;
  --dfNodeHoverTextColor: #000000;
  --dfNodeHoverBorderSize: 2px;
  --dfNodeHoverBorderColor: #000000;
  --dfNodeHoverBorderRadius: 4px;

  --dfNodeHoverBoxShadowHL: 0px;
  --dfNodeHoverBoxShadowVL: 2px;
  --dfNodeHoverBoxShadowBR: 15px;
  --dfNodeHoverBoxShadowS: 2px;
  --dfNodeHoverBoxShadowColor: #4ea9ff;

  --dfNodeSelectedBackgroundColor: rgba(255, 255, 255, 1);
  --dfNodeSelectedTextColor: null;
  --dfNodeSelectedBorderSize: 2px;
  --dfNodeSelectedBorderColor: #000000;
  --dfNodeSelectedBorderRadius: 4px;

  --dfNodeSelectedBoxShadowHL: 0px;
  --dfNodeSelectedBoxShadowVL: 2px;
  --dfNodeSelectedBoxShadowBR: 15px;
  --dfNodeSelectedBoxShadowS: 2px;
  --dfNodeSelectedBoxShadowColor: #4ea9ff;

  --dfInputBackgroundColor: #ffffff;
  --dfInputBorderSize: 2px;
  --dfInputBorderColor: #000000;
  --dfInputBorderRadius: 50px;
  --dfInputLeft: -27px;
  --dfInputHeight: 20px;
  --dfInputWidth: 20px;

  --dfInputHoverBackgroundColor: #ffffff;
  --dfInputHoverBorderSize: 2px;
  --dfInputHoverBorderColor: #000000;
  --dfInputHoverBorderRadius: 50px;

  --dfOutputBackgroundColor: #ffffff;
  --dfOutputBorderSize: 2px;
  --dfOutputBorderColor: #000000;
  --dfOutputBorderRadius: 50px;
  --dfOutputRight: -3px;
  --dfOutputHeight: 20px;
  --dfOutputWidth: 20px;

  --dfOutputHoverBackgroundColor: #ffffff;
  --dfOutputHoverBorderSize: 2px;
  --dfOutputHoverBorderColor: #000000;
  --dfOutputHoverBorderRadius: 50px;

  --dfLineWidth: 5px;
  --dfLineColor: #4682b4;
  --dfLineHoverColor: #4682b4;
  --dfLineSelectedColor: #43b993;

  --dfRerouteBorderWidth: 2px;
  --dfRerouteBorderColor: #000000;
  --dfRerouteBackgroundColor: #ffffff;

  --dfRerouteHoverBorderWidth: 2px;
  --dfRerouteHoverBorderColor: #000000;
  --dfRerouteHoverBackgroundColor: #ffffff;

  --dfDeleteDisplay: block;
  --dfDeleteColor: #ffffff;
  --dfDeleteBackgroundColor: #000000;
  --dfDeleteBorderSize: 2px;
  --dfDeleteBorderColor: #ffffff;
  --dfDeleteBorderRadius: 50px;
  --dfDeleteTop: -15px;

  --dfDeleteHoverColor: #000000;
  --dfDeleteHoverBackgroundColor: #ffffff;
  --dfDeleteHoverBorderSize: 2px;
  --dfDeleteHoverBorderColor: #000000;
  --dfDeleteHoverBorderRadius: 50px;

}

#drawflow {
  background: var(--dfBackgroundColor);
  background-size: var(--dfBackgroundSize) var(--dfBackgroundSize);
  background-image: var(--dfBackgroundImage);
}

.drawflow .drawflow-node {
  display: var(--dfNodeType);
  background: var(--dfNodeBackgroundColor);
  color: var(--dfNodeTextColor);
  border: var(--dfNodeBorderSize)  solid var(--dfNodeBorderColor);
  border-radius: var(--dfNodeBorderRadius);
  min-height: var(--dfNodeMinHeight);
  width: auto;
  min-width: var(--dfNodeMinWidth);
  padding-top: var(--dfNodePaddingTop);
  padding-bottom: var(--dfNodePaddingBottom);
  -webkit-box-shadow: var(--dfNodeBoxShadowHL) var(--dfNodeBoxShadowVL) var(--dfNodeBoxShadowBR) var(--dfNodeBoxShadowS) var(--dfNodeBoxShadowColor);
  box-shadow:  var(--dfNodeBoxShadowHL) var(--dfNodeBoxShadowVL) var(--dfNodeBoxShadowBR) var(--dfNodeBoxShadowS) var(--dfNodeBoxShadowColor);
}

.drawflow .drawflow-node:hover {
  background: var(--dfNodeHoverBackgroundColor);
  color: var(--dfNodeHoverTextColor);
  border: var(--dfNodeHoverBorderSize)  solid var(--dfNodeHoverBorderColor);
  border-radius: var(--dfNodeHoverBorderRadius);
  -webkit-box-shadow: var(--dfNodeHoverBoxShadowHL) var(--dfNodeHoverBoxShadowVL) var(--dfNodeHoverBoxShadowBR) var(--dfNodeHoverBoxShadowS) var(--dfNodeHoverBoxShadowColor);
  box-shadow:  var(--dfNodeHoverBoxShadowHL) var(--dfNodeHoverBoxShadowVL) var(--dfNodeHoverBoxShadowBR) var(--dfNodeHoverBoxShadowS) var(--dfNodeHoverBoxShadowColor);
}

.drawflow .drawflow-node.selected {
  background: var(--dfNodeSelectedBackgroundColor);
  color: var(--dfNodeSelectedTextColor);
  border: var(--dfNodeSelectedBorderSize)  solid var(--dfNodeSelectedBorderColor);
  border-radius: var(--dfNodeSelectedBorderRadius);
  -webkit-box-shadow: var(--dfNodeSelectedBoxShadowHL) var(--dfNodeSelectedBoxShadowVL) var(--dfNodeSelectedBoxShadowBR) var(--dfNodeSelectedBoxShadowS) var(--dfNodeSelectedBoxShadowColor);
  box-shadow:  var(--dfNodeSelectedBoxShadowHL) var(--dfNodeSelectedBoxShadowVL) var(--dfNodeSelectedBoxShadowBR) var(--dfNodeSelectedBoxShadowS) var(--dfNodeSelectedBoxShadowColor);
}

.drawflow .drawflow-node .input {
  left: var(--dfInputLeft);
  background: var(--dfInputBackgroundColor);
  border: var(--dfInputBorderSize)  solid var(--dfInputBorderColor);
  border-radius: var(--dfInputBorderRadius);
  height: var(--dfInputHeight);
  width: var(--dfInputWidth);
}

.drawflow .drawflow-node .input:hover {
  background: var(--dfInputHoverBackgroundColor);
  border: var(--dfInputHoverBorderSize)  solid var(--dfInputHoverBorderColor);
  border-radius: var(--dfInputHoverBorderRadius);
}

.drawflow .drawflow-node .outputs {
  float: var(--dfNodeTypeFloat);
}

.drawflow .drawflow-node .output {
  right: var(--dfOutputRight);
  background: var(--dfOutputBackgroundColor);
  border: var(--dfOutputBorderSize)  solid var(--dfOutputBorderColor);
  border-radius: var(--dfOutputBorderRadius);
  height: var(--dfOutputHeight);
  width: var(--dfOutputWidth);
}

.drawflow .drawflow-node .output:hover {
  background: var(--dfOutputHoverBackgroundColor);
  border: var(--dfOutputHoverBorderSize)  solid var(--dfOutputHoverBorderColor);
  border-radius: var(--dfOutputHoverBorderRadius);
}

.drawflow .connection .main-path {
  stroke-width: var(--dfLineWidth);
  stroke: var(--dfLineColor);
}

.drawflow .connection .main-path:hover {
  stroke: var(--dfLineHoverColor);
}

.drawflow .connection .main-path.selected {
  stroke: var(--dfLineSelectedColor);
}

.drawflow .connection .point {
  stroke: var(--dfRerouteBorderColor);
  stroke-width: var(--dfRerouteBorderWidth);
  fill: var(--dfRerouteBackgroundColor);
}

.drawflow .connection .point:hover {
  stroke: var(--dfRerouteHoverBorderColor);
  stroke-width: var(--dfRerouteHoverBorderWidth);
  fill: var(--dfRerouteHoverBackgroundColor);
}

.drawflow-delete {
  display: var(--dfDeleteDisplay);
  color: var(--dfDeleteColor);
  background: var(--dfDeleteBackgroundColor);
  border: var(--dfDeleteBorderSize) solid var(--dfDeleteBorderColor);
  border-radius: var(--dfDeleteBorderRadius);
}

.parent-node .drawflow-delete {
  top: var(--dfDeleteTop);
}

.drawflow-delete:hover {
  color: var(--dfDeleteHoverColor);
  background: var(--dfDeleteHoverBackgroundColor);
  border: var(--dfDeleteHoverBorderSize) solid var(--dfDeleteHoverBorderColor);
  border-radius: var(--dfDeleteHoverBorderRadius);
}

</style>
