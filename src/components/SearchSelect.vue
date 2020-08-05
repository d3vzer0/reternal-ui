<template>
  <q-card flat class="filter-rows search-select">
    <q-card-section>
      <q-select dense v-model="filterSelected" use-input input-debounce="0"
        :label="title" :options="filteredOptions" @filter="filterFn" behavior="menu">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No results
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </q-card-section>
  </q-card>
</template>
<script>

export default {
  name: 'SearchFilter',
  props: {
    id: String,
    title: String,
    endpoint: String,
    params: Object,
    store: String
  },
  data () {
    return {
      filteredOptions: [],
      filterSelected: '',
      queryOptions: [
      ]
    }
  },
  created () {
    this.queryParams = this.params
    this.getOptions()
  },
  watch: {
    filterSelected: {
      handler (value) {
        this.paramValue = value
      }
    },
    queryParams: {
      handler (value) {
        this.getOptions()
      },
      deep: true
    }
  },
  computed: {
    queryParams: {
      get () {
        return this.$store.state[this.store].queryParams
      },
      set (value) {
        this.$store.commit(`${this.store}/setQueryParams`, this.params)
      }
    },
    paramValue: {
      get () {
        return this.$store.state[this.store].queryParams[this.id]
      },
      set (value) {
        this.$store.commit(`${this.store}/setQueryParam`, { id: this.id, value: value.value })
      }
    }
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.filteredOptions = this.queryOptions
        })
        return
      }
      update(() => {
        this.filteredOptions = this.queryOptions.filter(qo => qo.label.includes(val))
      })
    },
    getOptions () {
      this.$axios
        .get(this.endpoint, {
          params: this.queryParams
        })
        .then(response => this.getOptionsSuccess(response['data']))
    },
    getOptionsSuccess (options) {
      this.queryOptions = [{ value: '', label: 'Any' }]
      options.forEach(option => {
        this.queryOptions.push({ 'value': option, 'label': option })
      })
    }
  }
}
</script>
