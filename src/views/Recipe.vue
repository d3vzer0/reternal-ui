<template>
  <div class="home">
    <b-row class="top-10" id="recipe-builder-editor">
      <b-col cols="12">
        <b-row>
          <b-col cols="6">
            <RecipeAddMitre></RecipeAddMitre>
          </b-col>
          <b-col cols="6">
            <RecipeAddCommand></RecipeAddCommand>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row class="top-10">
      <b-col cols="12">
       <RecipeOverview></RecipeOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import RecipeAddCommand from "@/components/recipe/RecipeAddCommand";
import RecipeAddMitre from "@/components/recipe/RecipeAddMitre";
import RecipeOverview from "@/components/recipe/RecipeOverview";

export default {
  name: "Recipe",
  data() {
    return {};
  },
  methods: {
    testclick() {
      console.log(this.$store.getters["task/date"]);
    }
  },
  components: {
    RecipeAddCommand,
    RecipeAddMitre,
    RecipeOverview,
  }
};
</script>


<style lang="scss" scoped>

#recipe-builder-editor {
  height: 300px;
}
</style>