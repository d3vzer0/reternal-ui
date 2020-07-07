<template>
  <q-card flat class="filter-rows search-text">
    <q-card-section>
      <q-input v-model="filterInput" :label="title" />
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
    }
  },
  created () {
    this.queryParams = this.params
  },
  watch: {
    filterInput: {
      handler (value) {
        this.paramValue = value
      }
    },
  },
  computed: {
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
