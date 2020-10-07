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
    params: Object,
    store: String
  },
  data () {
    return {
      filterSelected: '',
      filteredOptions: [],
      queryOptions: [
      ]
    }
  },
  created () {
    this.queryParams = this.params
    this.$store.state[this.store].filterValues[this.id] = [ ]
  },
  watch: {
    filterSelected: {
      handler (value) {
        this.paramValue = value
      }
    }
  },
  computed: {
    paramValue: {
      get () {
        return this.$store.state[this.store].queryParams[this.id]
      },
      set (value) {
        this.$store.commit(`${this.store}/setQueryParam`, { id: this.id, value: value.value })
      }
    },
    filterValues: {
      get () {
        return this.$store.state[this.store].filterValues[this.id]
      }
    }
  },
  methods: {
    filterFn (val, update) {
      if (val === '') {
        update(() => {
          this.filteredOptions = this.filterValues
        })
        return
      }
      update(() => {
        this.filteredOptions = this.filterValues.filter(qo => qo.label.includes(val))
      })
    }
  }
}
</script>
