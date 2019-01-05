<template>
  <b-modal ref="confirmstartup" id="confirmstartup" size="md" hide-footer title="Select platform to schedule on-startup recipe">
    <b-form method="post" @submit.prevent="save_boot">
      <b-row>
        <b-col cols="12">
           <b-form-select :options="platforms" v-model="selected_platform" required />
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12" class="top-10">
          <b-form-input type="text" v-model="startup_name" required placeholder="Name"></b-form-input>
        </b-col>
      </b-row>
      <b-row class="top-10">
        <b-col cols="12">
          <b-button type="submit" variant="primary">Confirm</b-button>
        </b-col>
      </b-row>
    </b-form>
  </b-modal>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "StartupModal",
  data(){
    return {
      platforms: ["Windows", "Linux", "macOS"],
      startup_name: "",
      recipe_data: {},
      selected_platform: ""
    }
  },
  mounted (){
    EventBus.$on('confirmboot', recipe_data =>{
      this.recipe_data = recipe_data;
      this.$refs.confirmstartup.show();
    });
  },
  methods: {
    save_boot (boot_data){
      this.$http
        .post('startuptasks', {platform: this.selected_platform, commands: this.recipe_data.commands, name: this.startup_name})
        .then(response => this.boot_success(response))
        .catch(error => EventBus.$emit('showalert', error.response))
    },
    boot_success (response){
      EventBus.$emit('showalert', response);
    }
  },
  components: {
  }
  
};
</script>

