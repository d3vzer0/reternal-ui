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
import MacroCreate from "@/components/MacroCreate";
import MacroOverview from "@/components/MacroOverview";

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
    MacroCreate,
    MacroOverview
  }
  
};
</script>
