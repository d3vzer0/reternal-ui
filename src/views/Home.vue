<template>
  <div class="home top-10">
    <b-row>
      <b-col>
        <b-card header="command selection" header-tag="header">
          <p class="card-text">Select command to issue to agent(s)</p>
          <b-form method="post" @submit.prevent="submit_task">
            <b-row>
              <b-col cols="3">
                <b-form-select :options="command_options" required/>
              </b-col>
              <b-col cols="7">
                <b-form-input type="text" placeholder="Command input"></b-form-input>
              </b-col>
              <b-col cols="2">
                <b-button type="submit" variant="primary" class="fullwidth">Submit</b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <MitreOverview></MitreOverview>
  </div>
</template>

<script>
import MitreOverview from "@/components/MitreOverview";
export default {
  name: "Home",
  data(){
    return {
      command_options: [
        { value: "shell_exec", text: "CMD" }
      ]
    }
  },
  components: {
    MitreOverview
  }
  
};
</script>
