<template>
  <b-row class="justify-content-center">  
    <b-col v-for="payload in available_payloads" :key="payload.platform">
      <div class="card mapping-card">
        <div class="card-header mapping-card-header">
          <font-awesome-icon :icon="['fab', 'windows']" v-if="payload.platform == 'windows'"/>
          <font-awesome-icon :icon="['fab', 'apple']" v-if="payload.platform == 'darwin'"/>
          <font-awesome-icon :icon="['fab', 'linux']" v-if="payload.platform == 'linux'"/>
        </div>
        <div class="card-body mapping-card-body">
          <b-list-group flush>
            <b-list-group-item v-for="type in payload.types" button @click="download_link(payload.platform, type.arch)">
              {{type.name}}
            </b-list-group-item>
          </b-list-group>
        </div>
      </div>
    </b-col>  
  </b-row>

</template>

<script>
import axios from "axios";

export default {
  name: "PayloadOverview",
  data() {
    return {
      available_payloads: [],
      selected_platform: "linux",
      selected_arch: ""
    };
  },
  mounted() {
    this.get_payloads();
  },
  methods: {
    get_payloads() {
      this.$http
        .get("payloads")
        .then(response => this.parse_payloads(response))
        .catch(response => this.generic_failed(response));
    },
    parse_payloads(response) {
      this.available_payloads = response.data;
    },
    download_link(platform, arch) {
      console.log(1)
      this.$http
        .get("payload", { responseType: 'blob', params: { 'platform': platform, 'arch':arch } })
        .then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'payload.bin');
          document.body.appendChild(link);
          link.click();
        })
    }
  }
};
</script>
