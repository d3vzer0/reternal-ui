<template>
  <q-dialog v-model="error_dialog" seamless position="top">
    <q-card style="width: 650px">
      <q-linear-progress :value="errorProgress" color="purple" />
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
      errorProgress: 0.10,
      errorDialog: false
    }
  },
  watch: {
    error_message: function (message) {
      this.onError()
    }
  },
  methods: {
    onError () {
      if (this.errorDialog === false) {
        this.errorDialog = true
        this.interval = setInterval(() => {
          if (this.errorProgress >= 1) {
            this.errorDialog = false
            // this.error_progress = 0.10
            return
          }
          this.errorProgress += 0.10
        }, 1000)
      }
    }
  }
}
</script>
