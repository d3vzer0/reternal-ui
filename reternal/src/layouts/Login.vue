<template>
  <q-layout view="hHh lpR fFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title></q-toolbar-title>
        <div>
          <q-toggle color="red" label="Dark Mode" v-model="darkmode" />
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="q-pa-md q-mt-lg">
        <error-message :error_message='error_response'></error-message>
    <!-- <q-dialog v-model="error_dialog" seamless position="top">
      <q-card style="width: 650px">
        <q-linear-progress :value="error_progress" color="purple" />
        <q-card-section class="row items-center no-wrap">
          <div> {{error_message}} </div>
          <q-space />
          <q-btn flat round icon="close" v-close-popup />
        </q-card-section>
      </q-card>
    </q-dialog> -->

        <div class="q-pa-md row items-start justify-center">
          <div class="col-4">
            <q-card>
              <q-card-section>
                <form @submit.prevent.stop="onLogin" class="q-gutter-md">
                  <div class="row">
                    <div class="col">
                      <q-input ref="username" v-model="username" label="Username" lazy-rules :rules="[ val => !!val || 'Please enter your username']">
                        <template v-slot:prepend>
                          <q-icon name="person_pin" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-input ref="password" v-model="password" label="Password" type="password" lazy-rules :rules="[ val => !!val || 'Please enter your password']">
                        <template v-slot:prepend>
                          <q-icon name="security" />
                        </template>
                      </q-input>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col">
                      <q-btn type="submit" flat label="Login" />
                    </div>
                  </div>
                </form>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>

export default {
  name: 'Login',
  components: {
    ErrorMessage: () => import('components/errors/ErrorMessage')
  },
  computed: {
    darkmode: {
      get: function () {
        return this.$q.dark.isActive
      },
      set: function (value) {
        this.$q.dark.set(value)
      }
    }
  },
  data () {
    return {
      username: '',
      password: '',
      error_response: null,
      error_dialog: false
      // error_dialog: false,
      // error_progress: 0.10
    }
  },
  methods: {
    onLogin () {
      this.$refs.username.validate()
      this.$refs.password.validate()
      this.$axios
        .post('login', { username: this.username, password: this.password })
        .then(response => this.onSuccess(response))
        .catch(error => this.onError(error))
    },
    onSuccess (response) {
      console.log('gotit')
    },
    onError (error) {
      this.error_response = error.response.data.message
      // this.error_response = 'abc'
      // this.error_dialog = true
      // this.error_message = response
      // this.interval = setInterval(() => {
      //   if (this.error_progress >= 1) {
      //     this.error_message = null
      //     this.error_dialog = false
      //     return
      //   }
      //   this.error_progress = this.error_progress + 0.10
      // }, 1000)
    }
  }
}
</script>
