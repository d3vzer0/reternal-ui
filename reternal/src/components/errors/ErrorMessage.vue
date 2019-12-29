<template>
  <q-dialog v-model="error_dialog" seamless position="top">
    <q-card style="width: 650px">
      <q-linear-progress :value="error_progress" color="purple" />
      <q-card-section class="row items-center no-wrap">
        <div> {{error_message}} </div>
        <q-space />
        <q-btn flat round icon="close" v-close-popup />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ErrorMessage',
  props: ['error_message'],
  data () {
    return {
      error_progress: 0.10,
      error_dialog: false
    }
  },
  created () {
    this.onError()
  },
  methods: {
    onError () {
      this.error_dialog = true
      this.interval = setInterval(() => {
        if (this.error_progress >= 1) {
          this.error_dialog = false
          return
        }
        this.error_progress += 0.10
      }, 1000)
    }
  }
}
</script>
