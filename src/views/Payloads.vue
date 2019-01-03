<template>
  <div class="payloads">
    <b-row class="top-10">
      <b-col cols="3">
         <b-card header="filter mitre" header-tag="header">
    <p class="card-text">Filter tiles to only display specific agents based on hostname, username or platform</p>
    <b-form method="get">
      <b-row>
        <b-col xl="3" lg="4" md="4" sm="6">
          <b-form-radio-group id="platform-select"  button-variant="primary-reversed">
          </b-form-radio-group>
        </b-col>
        <b-col xl="9" lg="8" md="8" sm="6">
          <b-form-input type="text" placeholder="Username or Hostname"></b-form-input>
        </b-col>
      </b-row>
    </b-form>
  </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>

export default {
  name: "Payloads",
  data(){
    return {
      agent_list: [],
    }
  },
  components: {

  }
  
};
</script>
