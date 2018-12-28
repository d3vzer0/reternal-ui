<template>
  <div class="home top-10">
    <b-row>
      <b-col>
        <b-card header="create macro" header-tag="header">
          <p class="card-text">Create custom macros based on existing/default commands</p>
          <b-form method="post" @submit.prevent="create_alias">
            <b-row>
              <b-col cols="2">
                <b-form-input type="text" placeholder="Alias name" v-model="create_alias_name" required></b-form-input>
              </b-col>
              <b-col cols="3">
                <CommandsDropdown></CommandsDropdown>
              </b-col>
              <b-col cols="6">
                <b-form-input type="text" placeholder="Command input" v-model="create_alias_input"></b-form-input>
              </b-col>
              <b-col>
                <b-button type="submit" variant="primary" class="fullwidth">Submit</b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import CommandsDropdown from "@/components/CommandsDropdown";

export default {
  name: "Commands",
  data(){
    return {
      create_alias_name: "",
      create_alias_input: ""
    }
  },
  methods: {
  },
  components: {
    CommandsDropdown
  }
  
};
</script>
