<template>
  <q-page>
    <!-- Top search row -->
    <div id="search-banner" class="q-pa-md row">
      <div class="col">
        <form @submit.prevent.stop="onSearch" class="q-gutter-md">
          <q-input square dark v-model="searchInput" label="Search Travel" color="white"/>
        </form>
      </div>
    </div>
    <!-- /Top search row -->

    <!-- Center content row -->
    <div class="q-pa-md q-mt-md row">
      <!-- Filter column -->
      <div class="col-3">

        <!-- Sort -->
        <div clas="row">
          <div class="col q-mt-sm">
            <q-card>
              <q-card-section>
                <q-select
                  v-model="sortOption"
                  :options="sortOptions" label="Sorteren" @input="onSearch()"/>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- /Sort -->

        <!-- Price range -->
        <div clas="row">
          <div class="col q-mt-sm">
            <q-card>
              <q-card-section class="q-pb-lg">
                <div class="text-subtitle2">Prijs range</div>
              </q-card-section>
              <q-card-section class="q-pl-lg q-pr-lg">
                <q-range
                  v-model="priceRange"
                  :min="priceMin"
                  :max="priceMax"
                  :step="50"
                  label-always
                  @change="onSearch()"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- /Price range -->

        <!-- Dynamic filters -->
        <div class="row q-mt-md" v-for="(options, filter) in responseFilters" v-bind:key="filter">
          <div class="col">
            <q-card class="filter-row">
              <q-card-section>
                <q-input v-model="options.limit">{{filter}}</q-input>
                <q-option-group :options="options['options'].filter(result => result.label.includes(options.limit))" label="Notifications" type="checkbox" v-model="options.selected" @input="onSearch()"/>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <!-- /Dynamic filters-->
      </div>
      <!-- Filter column -->

      <!-- Results column -->
      <div class="col q-pl-md">
        <div class="row" v-if="vakantieData.length > 0">
          <div class="col">
            <q-pagination
              v-model="currentPage" :max="totalPages"
              :direction-links="true" :max-pages="6"
              :boundary-numbers="true" @click="onSearch()">
            </q-pagination>
          </div>
          <div class="col">
            <q-btn color="primary float-right" icon="save" label="Export" />
          </div>
        </div>
        <div class="row">
          <div class="col-4 q-pl-md q-pa-lg" v-for="(vakantie) in vakantieData" v-bind:key="vakantie.daisycon_unique_id.raw">
            <q-card class="my-card">
              <q-img :src="extractRowValue(vakantie.default_image)">
                <q-btn class="q-ma-sm" flat v-if="!(selectedTravels.includes(vakantie.daisycon_unique_id.raw))" round color="white" icon="favorite_border" @click="addTravel(vakantie.daisycon_unique_id.raw)"/>
                <q-btn class="q-ma-sm" flat v-else round color="white" icon="favorite" @click="removeTravel(vakantie.daisycon_unique_id.raw)"/>
                <div class="absolute-bottom text-h6">
                  {{ extractRowValue(vakantie.title) }}
                </div>
              </q-img>
              <q-card-section v-if="vakantie.star_rating">
                <q-rating size="28px" v-model="vakantie.star_rating.raw" :max="5" readonly/>
                <q-icon size="28px" class="float-right" name="airplanemode_active" v-if="vakantie.travel_transportation_type.raw === 'Flight'"/>
                <q-icon size="28px" class="float-right" name="directions_car" v-if="vakantie.travel_transportation_type.raw === 'Car'"/>

              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col">
                    <b>Accomodatie</b>
                  </div>
                  <div class="col">
                    {{ extractRowValue(vakantie.accommodation_type) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <b>Continent</b>
                  </div>
                  <div class="col">
                    {{ extractRowValue(vakantie.destination_continent) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <b>Stad</b>
                  </div>
                  <div class="col">
                    {{ extractRowValue(vakantie.destination_city) }}
                  </div>
                </div>
                <div class="row">
                  <div class="col">
                    <b>Land</b>
                  </div>
                  <div class="col">
                    {{ extractRowValue(vakantie.destination_country) }}
                  </div>
                </div>
              </q-card-section>
              <!-- <q-separator dark /> -->
              <q-card-section>
                <div class="row">
                  <div class="col text-h5">
                    <b>€ {{ extractRowValue(vakantie.price) }}</b>
                  </div>
                  <div class="col text-h5">
                    <b class="float-right">{{ extractRowValue(vakantie.duration_days) }} Dagen</b>
                  </div>
                </div>
              </q-card-section>
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
// import { date } from 'quasar'
// let currentDate = new Date()

export default {
  name: 'PageIndex',
  computed: {
    filtered_ca: function () {
      return this.options.filter(ca => ca.label.includes(this.search_ca))
    },
    filter_tags: function () {
      return this.tag_options.filter(tag => tag.includes(this.search_tag))
    },

    queryFilters: function () {
      let filters = []
      for (var key in this.responseFilters) {
        let selectedValues = this.responseFilters[key].selected
        if (selectedValues.length > 0) {
          filters.push({ [key]: selectedValues })
        }
      }
      filters.push({ 'price': { 'from': this.priceRange.min, 'to': this.priceRange.max } })
      return { 'all': filters }
    },
    querySort: function () {
      return { [this.sortOption]: 'asc' }
    },
    queryContent: function () {
      let queryContent = {
        'query': this.searchInput,
        'facets': this.queryFacets,
        'filters': this.queryFilters,
        'sort': this.querySort,
        'page': {
          'size': this.pageSize,
          'current': this.currentPage
        }
      }
      return queryContent
    },
    queryFacets: function () {
      let facets = { 'price': [
        { 'type': 'value', 'name': 'max_price', 'sort': { 'value': 'desc' }, 'size': 1 },
        { 'type': 'value', 'name': 'min_price', 'sort': { 'value': 'asc' }, 'size': 1 }
      ] }
      this.searchFilters.forEach(function (filter) {
        facets[filter] = { 'type': 'value', 'size': 100 }
      })
      return facets
    }
  },
  data () {
    return {
      // Search specific filters
      priceMin: 0,
      priceMax: 3000,
      priceRange: {
        min: 0,
        max: 3000
      },
      currentPage: 1,
      pageSize: 20,
      totalPages: 0,
      totalResults: 0,
      selectedTravels: [],
      searchInput: '',
      sortOption: 'accommodation_name',
      sortOptions: [
        'airportcode_departure',
        'star_rating',
        'accommodation_type',
        'destination_city',
        'destination_continent'
      ],
      searchFilter: [],
      searchFilters: [
        'star_rating',
        'destination_city',
        'destination_continent',
        'travel_transportation_type',
        'accommodation_type'
      ],
      responseFilters: {},
      vakantieData: [
      ]
    }
  },
  created () {
    this.onSearch()
  },
  methods: {
    addTravel (travelName) {
      this.selectedTravels.push(travelName)
      console.log(this.selectedTravels)
    },
    removeTravel (travelName) {
      this.selectedTravels = this.selectedTravels.filter(item => item !== travelName)
      console.log(this.selectedTravels)
    },
    extractRowValue (rowData) {
      if (rowData) {
        return rowData.raw
      } else {
        return 'N/A'
      }
    },
    onSearch () {
      this.$axios
        .post('search', this.queryContent)
        .then(response => this.onSuccess(response))
        .catch(error => this.onError(error))
    },
    onSuccess (response) {
      this.vakantieData = response.data.results
      this.totalPages = response.data.meta.page.total_pages
      this.totalResults = response.data.meta.page.total_results
      let facets = response.data.facets
      for (var key in facets) {
        let options = []
        if (key !== 'price') {
          facets[key][0]['data'].forEach(function (facet) {
            options.push({ 'value': facet['value'], 'label': `${facet['value']} (${facet['count']})` })
          })
          let activeFilters = []
          this.queryFilters.all.forEach(function (filter) {
            if (key in filter) {
              activeFilters = filter[key]
            }
          })
          this.$set(this.responseFilters, key, { 'selected': activeFilters, 'limit': '', 'options': options })
        } else if (key === 'price') {
          this.priceMax = facets[key][0].data[0].value
          this.priceMin = facets[key][1].data[0].value
          this.priceRange.max = facets[key][0].data[0].value
          this.priceRange.min = facets[key][1].data[0].value
        }
      }
    },
    onError (error) {
      this.error_response = error.response.data.message
    }
  }
}
</script>
