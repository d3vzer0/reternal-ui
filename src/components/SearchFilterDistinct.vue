<template>
  <q-card flat class="filter-rows earchfilter">
    <q-card-section>
      <q-input v-model="filterInput" :label="title">
        <template v-slot:prepend>
          <q-icon name="find_in_page" />
        </template>
      </q-input>
      <q-option-group :options="filterValues.filter(qo => qo.label.includes(filterInput))" label="Level" type="radio" v-model="filterSelected" />
    </q-card-section>
  </q-card>
</template>
<script>
// import { vue } from 'Vue'

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
      filterInput: '',
      filterSelected: '',
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
    filterValues: {
      get () {
        return this.$store.state[this.store].filterValues[this.id]
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
  }
}
</script>
