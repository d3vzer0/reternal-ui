<template>
  <div class="recipes">
    <b-row class="top-10">
      <b-col cols="12">
       <!-- <RecipesFilter></RecipesFilter> -->
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
       <RecipesOverview></RecipesOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RecipesOverview from "@/components/saves/SavesOverview";
// import RecipesFilter from "@/components/saves/RecipesFilter";

export default {
  name: "Recipes",
  data() {
    return {};
  },
  components: {
    // RecipesFilter,
    RecipesOverview
  }
};
</script>
