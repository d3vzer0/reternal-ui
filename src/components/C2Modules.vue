<template>
  <q-card flat>
    <q-dialog v-model="showDescription">
      <q-card v-if="selectedIntegration">
        <q-card-section>
          <div class="text-h6">{{ integrationOptions[selectedIntegration].name }}</div>
        </q-card-section>

        <q-card-section>
          {{ integrationOptions[selectedIntegration].description }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-carousel
      v-model="slide"
      swipeable animated control-color="var(--primary-color)"
      arrows height="200px"
      >
      <q-carousel-slide :img-src="mapping.thumbnail" :name="integration" class="column no-wrap flex-center integration" v-for="(mapping, integration) in integrationOptions" v-bind:key="integration">
        <div class="text-center">
          <div class="div text-h5" >
            {{ mapping.name }}
          </div>
          <div class="div text-h5 q-mt-md">
            <span class="supported-platform q-pr-md" v-for="(platform, index) in mapping.platforms" v-bind:key="index">
              <q-icon name="fab fa-apple" v-if="platform === 'macOS'"/>
              <q-icon name="fab fa-windows" v-if="platform === 'Windows'"/>
              <q-icon name="fab fa-linux" v-if="platform === 'Linux'"/>
            </span>
          </div>
          <div class="div absolute-bottom text-right q-pa-sm">
            <q-badge color="red" v-if="!mapping.enabled">
              Disabled <q-icon name="warning" color="white" class="q-ml-xs" />
            </q-badge>
           <q-btn flat icon="info" @click="showDescription = true, selectedIntegration = integration"  />
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </q-card>
</template>

<script>

export default {
  name: 'C2ModulesActive',
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
    }
  },
  watch: {
    integrationOptions: function (element) {
      this.slide = Object.keys(this.integrationOptions)[0]
    }
  },
  data () {
    return {
      slide: null,
      selectedIntegration: null,
      showDescription: false
    }
  },
  created () {
    this.$getIntegrations()
  }
}
</script>

<style lang="scss">
.integration {
  color: white;
}
</style>>
