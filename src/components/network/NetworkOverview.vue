<template>
  <b-card class="networkcard">
    <d3-network :net-nodes="nodes" :net-links="links" :options="options">
    </d3-network>
  </b-card>
</template>

<script>
import D3Network from 'vue-d3-network'
// var D3Network = window['vue-d3-network']

export default {
  name: "NetworkOverview",
  data() {
    return {
      nodes: [
        { id: 1, name: 'my node 1', svgSym:'<font-awesome-icon icon="tasks" />' },
        { id: 2, name: 'my node 2' },
        { id: 3, _color:'orange' },
        { id: 4 },
        { id: 5 },
        { id: 6 },
        { id: 7 },
        { id: 8 },
        { id: 9 }
      ],
      links: [
        { sid: 1, tid: 2, _color:'r ed' },
        { sid: 2, tid: 8, _color:'f0f' },
        { sid: 3, tid: 4, _color:'rebeccapurple' },
        { sid: 4, tid: 5, _color:'red' },
        { sid: 5, tid: 6, _color:'red' },
        { sid: 7, tid: 8, _color:'red' },
        { sid: 5, tid: 8, _color:'red' },
        { sid: 3, tid: 8, _color:'red' },
        { sid: 7, tid: 9, _color:'red' }
      ],
      options:
      {
        force: 3000,
        nodeSize: 50,
        nodeLabels: true,
        linkWidth:5,
        canvas: false
      }
    };
  },
  methods: {},
  components: {
    D3Network
  }
};
</script>

<style lang="scss" scoped>

.geenideenog{
  font-family: FontAwesome;
  fill:green;
}
</style>
