<template>
  <b-card>
    <b-form method="post" @submit.prevent="add_command">
      <b-row>
        <b-col cols="12">
        <vue-ctk-date-time-picker inline without-header v-model="date_time" time-format="HH:mm" format="X" color="#9d3a3a"></vue-ctk-date-time-picker>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
</template>

<script>
import Vue from "vue";
import VueCtkDateTimePicker from "vue-ctk-date-time-picker";
import "vue-ctk-date-time-picker/dist/vue-ctk-date-time-picker.css";
Vue.component("vue-ctk-date-time-picker", VueCtkDateTimePicker);

export default {
  name: "RecipeDatetime",
  data() {
    return {};
  },
  computed: {
    date_time: {
      get: function() {
        return this.$store.getters["task/date"];
      },
      set: function(value) {
        this.$store.commit("task/change_date", value);
      }
    }
  },
  methods: {},
  components: {}
};
</script>
