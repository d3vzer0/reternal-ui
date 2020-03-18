<template>
  <q-page>

    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-2">

        <!-- Dynamic filters -->
        <div class="row q-mt-md">
          <div class="col">
            <q-card flat class="filter-row">
              <q-card-section>
                <q-option-group :options="platformOptions" label="Platform" type="radio" v-model="selectedPlatform" />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col">
        <div class="row">

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

          <div class="col-4 q-pa-md" v-for="(mapping, integration) in filteredIntegrations" v-bind:key="integration">
            <q-card flat class="my-card">
              <q-img :src="mapping.thumbnail" v-if="mapping.thumbnail" style="height: 200px; background-color: rgba(0, 0, 0, 0.47)" >
                <div class="absolute-full">
                  <div class="absolute-top text-right text-h5 q-pa-md">
                    <span class="supported-platform q-pr-md" v-for="(platform, index) in mapping.platforms" v-bind:key="index">
                      <q-icon name="fab fa-apple" v-if="platform === 'macOS'"/>
                      <q-icon name="fab fa-windows" v-if="platform === 'Windows'"/>
                      <q-icon name="fab fa-linux" v-if="platform === 'Linux'"/>
                    </span>
                  </div>
                  <div class="absolute-bottom text-left text-h6 q-pa-md">
                    {{ mapping.name }}
                  </div>
                </div>
              </q-img>

              <q-img src="/statics/haha_php.jpeg" v-else>
                <div class="absolute-bottom text-left">
                  <div class="text-h6">
                    {{ integration }}
                  </div>
                  <div class="text-h6">
                    <div class="supported-platform" v-for="(platform, index) in mapping.platforms" v-bind:key="index">
                      <q-icon name="fab fa-apple" />
                    </div>
                  </div>
                </div>
              </q-img>

              <q-separator />
              <q-card-actions align="around">
                <q-btn flat icon="list_alt" @click="showDescription = true" />
                <q-btn flat icon="fas fa-cogs" />
                <q-btn flat icon="info" @click="showDescription = true, selectedIntegration = integration"  />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
      <!-- /Results column -->

    </div>
    <!-- /Center content row -->
  </q-page>
</template>

<script>

export default {
  name: 'Integrations',
  computed: {
    filteredIntegrations: function () {
      const filteredIntegrations = {}
      for (var integration in this.integrationOptions) {
        if (this.integrationOptions[integration].platforms.includes(this.selectedPlatform)) {
          filteredIntegrations[integration] = this.integrationOptions[integration]
        }
      }
      return filteredIntegrations
    },
    integrationOptions: {
      get () {
        return this.$store.state.integrations.integrationOptions
      }
    }
  },
  data () {
    return {
      platformOptions: [
        { 'value': 'Windows', 'label': 'Windows' },
        { 'value': 'macOS', 'label': 'MacOS' },
        { 'value': 'Linux', 'label': 'Linux' }
      ],
      selectedPlatform: 'Windows',
      selectedIntegration: null,
      showDescription: false,
      showPlatforms: false,
      showTasks: false
    }
  },
  created () {
    this.$getIntegrations()
  }
}
</script>
