<template>
  <div class="home">
    <b-row class="top-10">
      <b-col cols="5">
        <RecipeDatetime></RecipeDatetime>
      </b-col>
      <b-col cols="7">
        <b-row>
          <b-col>
            <RecipeAddMitre></RecipeAddMitre>
          </b-col>
        </b-row>
        <b-row>
          <b-col>
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
import RecipeDatetime from "@/components/recipe/RecipeDatetime";

export default {
  name: "Recipe",
  data(){
    return {
    
    }
  },
  methods: {
    testclick (){
      console.log(this.$store.getters['task/date'])
    }
  },
  components: {
    RecipeAddCommand,
    RecipeAddMitre,
    RecipeOverview,
    RecipeDatetime
  }
  
};
</script>
