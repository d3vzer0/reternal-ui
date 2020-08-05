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
          <q-btn flat icon="mail">
            <q-badge floating color="red" v-if="notifications.length">{{ notifications.length }}</q-badge>
            <q-menu fit v-if="notifications.length">
              <div class="row no-wrap q-pa-md" style="width: 400px">
                <div class="col-10">
                  <q-list seperator>
                    <q-item v-for="notification in notifications" v-bind:key="notification.id">
                      <q-item-section>
                        <q-item-label>{{ notification.title }} </q-item-label>
                        <q-item-label caption lines="2">{{ notification.message }}</q-item-label>
                      </q-item-section>
                      <q-item-section side top>
                        <q-item-label caption>{{ timeAgo(notification.datetime) }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
                <div class="col-2">
                  <span class="float-right"><q-btn flat icon="clear_all" @click="clearNotifications()"/></span>
                </div>
              </div>
            </q-menu>
          </q-btn>
          <q-btn-dropdown flat icon="person_pin" v-if="profile" :label="'Hi, ' + profile.name">
            <q-list>
              <q-item>
                  <q-item-section side>
                    <q-avatar>
                      <img :src="profile.picture">
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ profile.nickname }}</q-item-label>
                    <q-item-label caption lines="2">{{ profile.email }}</q-item-label>
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
          <q-item clickable v-ripple to='/results'>
            <q-item-section avatar>
              <q-icon name="mdi-check-circle-outline" />
            </q-item-section>
            <q-item-section>
              Results
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to='/campaign'>
            <q-item-section avatar>
              <q-icon name="mdi-graph" />
            </q-item-section>
            <q-item-section>
              Campaign
            </q-item-section>
          </q-item>
          <q-separator />
          <q-separator />
          <q-item clickable v-ripple to="/sigma">
            <q-item-section avatar>
              <q-icon name="policy" />
            </q-item-section>
            <q-item-section>
              Sigma
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/techniques">
            <q-item-section avatar>
              <q-icon name="mdi-bullseye" />
            </q-item-section>
            <q-item-section>
              Techniques
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/mitre">
            <q-item-section avatar>
              <q-icon name="mdi-playlist-check" />
            </q-item-section>
            <q-item-section>
              Coverage
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/coverage">
            <q-item-section avatar>
              <q-icon name="mdi-database-import" />
            </q-item-section>
            <q-item-section>
              Datasources
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
          <q-item clickable v-ripple to="/stagers">
            <q-item-section avatar>
              <q-icon name="save_alt" />
            </q-item-section>
            <q-item-section>
              Stagers
            </q-item-section>
          </q-item>
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
import moment from 'moment'

// import mgr from '../auth'

export default {
  name: 'MainView',
  computed: {
    profile: {
      get: function () {
        console.log(this.$store.state.user.access_token)
        return this.$store.state.user.profile
      }
    },
    darkmode: {
      get: function () {
        return this.$q.dark.isActive
      },
      set: function (value) {
        this.$q.dark.set(value)
      }
    },
    notifications: {
      get: function () {
        return this.$store.state.notifications.notifications
      }
    },
    asyncTasks: {
      get: function () {
        return this.$store.state.asyncTasks.tasks
      }
    }
  },
  sockets: {
    connect: function () {
      console.log('connected yo')
    },
    notification: function (data) {
      var notification = {
        title: 'Notification',
        from: data.from,
        message: data.content.message,
        datetime: moment().format()
      }
      this.$store.commit('notifications/addNotification', notification)
    }
  },
  data () {
    return {
      // profile: {},
      leftDrawerOpen: false,
      miniState: true
    }
  },
  created () {
    this.$socket.client.open()
  },
  methods: {
    setWebsocket () {
      this.$socket.client.emit('notification', { message: 'doei' })
    },
    timeAgo (datetime) {
      return moment(datetime).fromNow()
    },
    clearNotifications () {
      this.$store.commit('notifications/clearNotifications')
    },
    getTaskState (task) {
      this.$axios
        .get('/state/' + task.taskId)
        .then(response => this.getTaskStateSuccess(response['data'], task))
    },
    getTaskStateSuccess (taskState, task) {
      if (taskState === 'SUCCESS') {
        this.$store.commit('asyncTasks/pull', task.taskId)
        var notification = {
          title: task.taskName + ' success',
          message: 'Succesfully completed task ' + task.taskName,
          datetime: moment().format()
        }
        this.$store.commit('notifications/addNotification', notification)
      }
    },
    pollTasks () {
      setInterval(() => {
        this.asyncTasks.forEach(task => {
          this.getTaskState(task)
        })
      }, 10000)
    }
  }
}
</script>
