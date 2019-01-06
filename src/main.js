import "@babel/polyfill";
import "./plugins/bootstrap-vue";

import Vue from "vue";
import App from "./App.vue";
import axios from "./api"
import router from "./router";

import { store } from "./store"
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import { faTerminal, faCog, faEye, faBullseye, faUser, faBookmark  } from "@fortawesome/free-solid-svg-icons"
import { faHome, faDesktop, faMap, faCalendar, faDownload, faInfo} from "@fortawesome/free-solid-svg-icons"
import { faArchive, faPlayCircle, faTasks, faArrowAltCircleDown, faArrowRight} from "@fortawesome/free-solid-svg-icons"

library.add(
  faTerminal,
  faCog,
  faEye,
  faBullseye,
  faCalendar,
  faHome,
  faDesktop,
  faMap,
  faDownload,
  faUser,
  faInfo,
  faBookmark,
  faArchive,
  faPlayCircle,
  faTasks,
  faArrowAltCircleDown,
  faArrowRight,
);

Vue.component("font-awesome-icon", FontAwesomeIcon)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  axios,
  render: h => h(App)
}).$mount("#app");
