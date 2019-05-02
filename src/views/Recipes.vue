<template>
  <div class="recipes">
    <b-row class="top-10">
      <b-col cols="2">
       <SavesFilter></SavesFilter>
      </b-col>
      <b-col cols="10">
       <SavesOverview></SavesOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import SavesOverview from "@/components/saves/SavesOverview";
import SavesFilter from "@/components/saves/SavesFilter";

export default {
  name: "Recipes",
  data() {
    return {};
  },
  components: {
    SavesFilter,
    SavesOverview
  }
};
</script>
