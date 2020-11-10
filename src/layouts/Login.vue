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
          <div class="col-xl-2 col-md-3 col-xs-6">
            <q-card>
              <q-card-section>
                  <div class="col" style="text-align:center;">
                    <q-spinner
                      color="primary"
                      size="xl"
                    />
                  </div>
              </q-card-section>
              <q-card-section>
                <div class="text-h6 text-center">
                    Authenticating ...
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
      const currentQuery = this.$route.query
      if ('code' in currentQuery) {
        this.$oauth.signinRedirectCallback().then(user => {
          this.$store.commit('user/setUser', user)
          this.$setSocket(user.access_token)
          this.$router.push({ path: '/' })
        })
      } else {
        this.authenticateInit()
      }
    }
  }
}
</script>
