<template>
  <q-page>
    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row justify-around">
      <!-- Filter column -->
      <div class="col-3">
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

        <q-card flat>
          <q-carousel
            v-model="slide"
            swipeable animated control-color="var(--primary-color)"
            arrows height="200px"
            >
            <q-carousel-slide :img-src="mapping.thumbnail" name="style" class="column no-wrap flex-center integration" v-for="(mapping, integration) in integrationOptions" v-bind:key="integration">
              <!-- <q-icon name="style" size="56px" /> -->
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
                  <q-btn flat icon="info" @click="showDescription = true, selectedIntegration = integration"  />
                </div>
              </div>
            </q-carousel-slide>
          </q-carousel>
        </q-card>
      </div>
      <div class="col-3">
        <q-card flat>
          <q-card-section>
            <div class="text-h6">Tasks</div>
         </q-card-section>
          <q-card-section>
           a
          </q-card-section>
        </q-card>
      </div>
      <div class="col-3">
        <q-card flat>
          <q-card-section>
            <div class="text-h6">Techniques</div>
         </q-card-section>
          <q-card-section>
            a
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="row q-pa-md q-mt-md justify-around">
      <div class="col-11">
        <q-table
          flat
          title="Scheduled tasks"
          :data="data"
          :columns="columns"
          row-key="name"
        />
      </div>
    </div>
  </q-page>
</template>

<script>

export default {
  name: 'PageIndex',
  computed: {
    filtered_ca: function () {
      return this.options.filter(ca => ca.label.includes(this.search_ca))
    },
    filter_tags: function () {
      return this.tag_options.filter(tag => tag.includes(this.search_tag))
    },
    integrationOptions: {
      get () {
        return this.$store.state.integrations.integrationOptions
      }
    }
  },
  data () {
    return {
      slide: 'style',
      selectedIntegration: null,
      showDescription: false,
      columns: [
        { name: 'name', required: true }
      ],
      data: [
        { name: 'okdoei' },
        { name: 'okhoi' }
      ]
    }
  },
  created () {
    this.$getIntegrations()
  },
  methods: {
  }
}
</script>

<style lang="scss">
.integration {
  color: white;
}
</style>
