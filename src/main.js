import "@babel/polyfill";
import "./plugins/bootstrap-vue";

import Vue from "vue";
import App from "./App.vue";
import axios from "./api"
import router from "./router";

import { store } from "./store"
import { library } from "@fortawesome/fontawesome-svg-core"
import { faTerminal, faCog, faEye, faBullseye } from "@fortawesome/free-solid-svg-icons"
import { faHome, faDesktop, faMap, faCalendar, faDownload } from "@fortawesome/free-solid-svg-icons"
import { faUser } from "@fortawesome/free-regular-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

library.add(faTerminal, faCog, faEye, faBullseye, faCalendar, faHome, faDesktop, faMap, faDownload, faUser)
Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  axios,
  render: h => h(App)
}).$mount("#app");
