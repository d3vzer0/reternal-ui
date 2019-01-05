<template>
  <div class="createmacro">
    <b-row class="top-10">
      <b-col>
        <MacroCreate></MacroCreate>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col>
        <MacroOverview></MacroOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import MacroCreate from "@/components/macro/MacroCreate";
import MacroOverview from "@/components/macro/MacroOverview";

export default {
  name: "Macros",
  data(){
    return {
      create_alias_name: "",
      create_alias_input: ""
    }
  },
  methods: {
  },
  components: {
    MacroCreate,
    MacroOverview
  }
  
};
</script>
