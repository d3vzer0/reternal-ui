<template>
  <div id="payloads">
    <b-row>
      <b-col>
        <b-card>
          <b-row>
            <b-col cols="1">
              <b-button @click="build_payloads()" variant="dark"><font-awesome-icon icon="hammer"/></b-button>
            </b-col>
            <b-col>
                <b-progress :value="build_count" :max="payload_count" show-progress animated></b-progress>
            </b-col>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-row class="justify-content-center top-10">  
      <b-col v-for="(types, platform) in available_payloads" :key="platform">
        <div class="card mapping-card">
          <div class="card-header mapping-card-header">
            <font-awesome-icon :icon="['fab', 'windows']" v-if="platform == 'windows'"/>
            <font-awesome-icon :icon="['fab', 'apple']" v-if="platform == 'darwin'"/>
            <font-awesome-icon :icon="['fab', 'linux']" v-if="platform == 'linux'"/>
          </div>
          <div class="card-body mapping-card-body">
            <b-list-group flush>
              <b-list-group-item :disabled="context.build_state != 'SUCCESS'" v-for="(context, arch) in types" button @click="download_link(platform, arch)">
                {{context.name}}
                <span v-if="context.build_state != 'SUCCESS'">(not available)</span>  
              </b-list-group-item>
            </b-list-group> 
          </div>
        </div>
      </b-col>  
    </b-row>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "PayloadOverview",
  data() {
    return {
      file_names: {
        'windows': 'payload-win.exe',
        'linux': 'payload-linux.bin',
        'darwin': 'payload-darwin.bin'
      }
    };
  },
  created() {
    this.get_payloads();
  },
  computed: {
    available_payloads: function () {
      return this.$store.getters['payloads/get_payloads']
    },
    payload_count: function () {
      return this.$store.getters['payloads/payload_count']
    },
    build_count: function () {
      return this.$store.getters['payloads/build_count']
    },
    c2_dest: function () {
      return this.$store.getters['agents/get_dest']
    }
  },
  methods: {
    get_payloads() {
      this.$http
        .get("payloads")
        .then(response => this.parse_payloads(response.data))
        .catch(response => this.generic_failed(response));
    },
    parse_payloads(payloads){
      this.$store.commit('payloads/add_payloads', payloads)
      this.get_states()
    },
    build_payloads () {
      this.$store.commit('payloads/clear_state')
      for (const [platform, types] of Object.entries(this.available_payloads)) {
        for (const [arch, context] of Object.entries(types)) {
          this.$http
            .post("payload",  { 'platform': platform, 'arch': arch,
              'base_url': this.c2_dest})
        }
      }
    },
    get_states(){
      for (const [platform, types] of Object.entries(this.available_payloads)) {
        for (const [arch, context] of Object.entries(types)) {
          this.$http
            .get("payload",  { params: { 'platform': platform, 'arch': arch, 'base_url': this.c2_dest}})
            .then(response => this.$store.commit('payloads/change_state', response.data))
        }
      }
    },
    download_link(platform, arch) {
      this.$http
        .get("payload/get", { responseType: 'blob', params: { 'platform': platform, 'arch':arch, 'base_url': this.c2_dest} })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.file_names[platform]);
          document.body.appendChild(link);
          link.click();
        })
    }
  }
};
</script>

<style lang="scss" scoped>

.progress {
  margin-top: 10px;
  .progress-bar {
    background-color: red !important;
  }
}


</style>

