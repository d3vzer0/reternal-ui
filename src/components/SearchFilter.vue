<template>
  <q-card flat class="filter-rows earchfilter">
    <q-card-section>
      <q-input v-model="filterInput" :label="title">
        <template v-slot:prepend>
          <q-icon name="find_in_page" />
        </template>
      </q-input>
      <q-option-group :options="queryOptions.filter(qo => qo.label.includes(filterInput))" label="Level" type="radio" v-model="filterSelected" />
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
      filterInput: '',
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
        this.$store.commit(`${this.store}/setQueryParam`, { id: this.id, value: value })
      }
    }
  },
  methods: {
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
