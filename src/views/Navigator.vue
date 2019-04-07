<template>
  <div class="navigator">
    <vue-friendly-iframe v-show="loading" :src="navigator_url" className="navigator-frame" @load="loading = true"></vue-friendly-iframe>
  </div>
</template>

<script>
import VueFriendlyIframe from 'vue-friendly-iframe'
export default {
  name: "Navigator",
  data() {
    return {
      navigator_url: '/mitre-navigator/index.html#header=false',
    };
  },
  computed: {
    loading: {
      get: function() {
        return this.$store.getters['iframe/get_loading']
      },
      set: function(loading_state) {
        this.$store.commit('iframe/set_loading', loading_state)
      }
    }

  },
  components: {
    VueFriendlyIframe
  }
};
</script>

<style lang="scss">

.navigator {
  margin-left: -50px;
  margin-right: -50px;
  .navigator-spinner {
    margin-top: 300px;
  }
}

.navigator-frame {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color:#f4f2f2;
    border-style: none;
    
}

</style>
