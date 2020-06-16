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
        <div class="q-pa-md row items-start justify-center">
          <div class="col-2">
            <q-card>
              <q-card-section>
                <div class="row">
                  <div class="col" style="text-align:center;">
                     <q-icon name="mdi-shield-account" color="primary" style="font-size:100px"/>
                  </div>
                </div>
                <div class="row q-mt-lg">
                  <div class="col">
                    <q-btn type="submit" unelevated @click="authenticateInit()" label="Authenticate" class="full-width"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
// import mgr from '../auth'

export default {
  name: 'Login',
  components: {
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
  created () {
    this.authenticated()
  },
  data () {
    return {
    }
  },
  methods: {
    async authenticateInit () {
      this.$oauth.signinRedirect()
    },
    async authenticated () {
      if (this.$route.query) {
        this.$oauth.signinRedirectCallback().then(user => {
          this.$store.commit('user/setUser', user)
          this.$router.push({ path: '/' })
        })
      }
    }
  }
}
</script>
