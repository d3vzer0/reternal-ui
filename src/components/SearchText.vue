<template>
  <q-card flat class="filter-rows search-text">
    <q-card-section>
      <q-input dense square v-model="filterInput" :label="title" v-on:keyup.enter="searchItems"/>
    </q-card-section>
  </q-card>
</template>
<script>

export default {
  name: 'SearchFilter',
  props: {
    id: String,
    title: String,
    store: String
  },
  data () {
    return {
      filterInput: ''
    }
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
  },
  methods: {
    searchItems (item) {
      this.paramValue = this.filterInput
    }
  }
}
</script>
