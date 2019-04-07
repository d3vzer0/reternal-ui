import "@babel/polyfill";
import "./plugins/bootstrap-vue";

import Vue from "vue";
import App from "./App.vue";
import axios from "./api";
import router from "./router";
import VueSocketio from "vue-socket.io-extended";
import io from "socket.io-client";
import { store } from "@/store";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import {
  faMapMarked,
  faSearch,
  faTerminal,
  faKey,
  faCog,
  faEye,
  faBullseye,
  faUser,
  faBookmark,
  faHome,
  faDesktop,
  faMap,
  faCalendar,
  faDownload,
  faInfo,
  faLink,
  faArchive,
  faPlayCircle,
  faTasks,
  faArrowAltCircleDown,
  faArrowRight,
  faSave,
  faGlobeEurope,
  faEthernet,
  faClock,
  faPlus,
  faKeyboard,
  faHammer,
  faPlug
} from "@fortawesome/free-solid-svg-icons";

import {
  faWindows,
  faLinux,
  faApple
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faSearch,
  faMapMarked,
  faPlug,
  faWindows,
  faLinux,
  faEthernet,
  faApple,
  faKey,
  faGlobeEurope,
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
  faLink,
  faKeyboard,
  faSave,
  faHammer,
  faPlus,
  faClock
);

const socket = io(process.env.VUE_APP_SOCKETHOST, {
  autoConnect: false
});

Vue.use(VueSocketio, socket);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.config.productionTip = false;


new Vue({
  store,
  router,
  axios,
  render: h => h(App)
}).$mount("#app");
