<template>
  <b-card-group columns>
    <b-card :header="payload.platform" v-for="payload in available_payloads">
      <b-list-group flush>
        <b-list-group-item v-for="type in payload.types">
          <b-button variant="primary" :href="download_link(payload.platform, type.arch)">{{type.name}}</b-button>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>
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
      var payload_path = `${
        axios.defaults.baseURL
      }payload?platform=${platform}&arch=${arch}`;
      return payload_path;
    }
  }
};
</script>
