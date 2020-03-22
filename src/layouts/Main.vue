<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round @click="leftDrawerOpen = !leftDrawerOpen" icon="menu" aria-label="Menu"/>
        <!-- <q-btn flat dense round @click="miniState = !miniState" icon="menu" aria-label="Menu"/> -->
        <q-toggle color="red" label="Dark Mode" v-model="darkmode" />
        <q-toolbar-title></q-toolbar-title>
        <div class="action-controls q-ml-lg">
          <!-- <q-btn flat icon="info" />
          <q-btn flat icon="call_to_action" /> -->
        </div>
        <div class="">
          <q-btn-dropdown flat icon="person_pin" v-if="$auth.user" :label="'Hi, ' + $auth.user.nickname">
            <q-list>
              <q-item>
                  <q-item-section side>
                    <q-avatar>
                      <img :src="$auth.user.picture">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ $auth.user.nickname }}</q-item-label>
                    <q-item-label caption lines="2">{{ $auth.user.email }}</q-item-label>
                  </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable>
                <q-item-section>Logout</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      mini-to-overlay
      @mouseout="miniState = true"
      @mouseover="miniState = false"
      :mini="miniState"
      :width="200"
      :breakpoint="500"
      bordered>
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item clickable v-ripple to="/">
            <q-item-section avatar>
              <q-icon name="home" />
            </q-item-section>
            <q-item-section>
              Home
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to='/campaign'>
            <q-item-section avatar>
              <q-icon name="list_alt" />
            </q-item-section>
            <q-item-section>
              Campaign
            </q-item-section>
          </q-item>
          <q-separator />
          <q-separator />
          <q-item clickable v-ripple to="/techniques">
            <q-item-section avatar>
              <q-icon name="link" />
            </q-item-section>
            <q-item-section>
              Techniques
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/mitre">
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>
            <q-item-section>
              ATT&CK
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/coverage">
            <q-item-section avatar>
              <q-icon name="spellcheck" />
            </q-item-section>
            <q-item-section>
              DeTTECT
            </q-item-section>
          </q-item>
          <q-separator />
          <q-item clickable v-ripple to="/agents">
            <q-item-section avatar>
              <q-icon name="desktop_windows" />
            </q-item-section>
            <q-item-section>
              Agents
            </q-item-section>
          </q-item>
           <q-item clickable v-ripple to='/listeners'>
            <q-item-section avatar>
              <q-icon name="settings_ethernet" />
            </q-item-section>
            <q-item-section>
              Listeners
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/payloads">
            <q-item-section avatar>
              <q-icon name="save_alt" />
            </q-item-section>
            <q-item-section>
              Stagers
            </q-item-section>
          </q-item>
          <!-- <q-separator />
          <q-separator />
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="bookmark" />
            </q-item-section>
            <q-item-section>
              Shortcuts
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="save" />
            </q-item-section>
            <q-item-section>
              Saves
            </q-item-section>
          </q-item> -->
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <div class="header-float"></div>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainView',
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
      leftDrawerOpen: false,
      miniState: true
    }
  }
}
</script>
