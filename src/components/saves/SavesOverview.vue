<template>
  <b-card-group class="recipespanel">
    <b-card header="Recipe" class="col-3">
      <b-list-group flush>
        <b-list-group-item v-for="recipe in recipe_list" 
          :class="{'selectedrecipe': (recipe._id['$oid'] == selected_recipe)}" :key="recipe._id['$oid']">
          <b-row>
            <b-col cols="8" @click="get_commands(recipe.name), command_list = recipe.commands, selected_recipe = recipe._id['$oid'], show_commands = true, show_input = false">
              {{recipe.name}} 
            </b-col>
            <b-col>
              <b-badge href="#" @click="delete_recipe(recipe.name)">DELETE</b-badge>
            </b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
    
    <b-card header="Command" class="col-3">
      <b-list-group flush v-if="show_commands">
        <b-list-group-item v-for="(command, index) in command_list" 
          :key="index" :class="{'selectedcommand': (index == selected_command)}"
          @click="command_data = command, show_input = true, selected_command = index">

          <div v-if="command.metadata">{{command.metadata.name}}</div>
          <div v-else-if="command.commands">{{command.commands.name}}</div>

        </b-list-group-item>
      </b-list-group>
    </b-card>

    <b-card header="Input">
      <b-list-group flush v-if="show_input">
        <b-list-group-item v-if="this.command_data.metadata">
          <b-row>
            <b-col><b>Phase</b></b-col>
            <b-col>{{this.command_data.metadata.kill_chain_phase}}</b-col>
          </b-row>  
        </b-list-group-item>
        <b-list-group-item v-if="this.command_data.metadata">
          <b-row>
            <b-col><b>Technique</b></b-col>
            <b-col>{{this.command_data.metadata.technique_name}}</b-col>
          </b-row>  
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Command</b></b-col>
            <b-col>{{this.command_data.commands.name}}</b-col>
          </b-row>  
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Type</b></b-col>
            <b-col>{{this.command_data.commands.type}}</b-col>
          </b-row>  
        </b-list-group-item>
         <b-list-group-item>
          <b-row>
            <b-col><b>Input</b></b-col>
            <b-col>{{this.command_data.commands.input}}</b-col>
          </b-row>
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col><b>Sleep</b></b-col>
            <b-col>{{this.command_data.commands.sleep}}</b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
    </b-card>
  </b-card-group>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "RecipesOverview",
  data() {
    return {
      selected_recipe: "",
      selected_command: "",
      recipe_list: [],
      command_list: [],
      command_data: {},
      show_commands: false,
      show_input: false,
    };
  },
  mounted() {
    EventBus.$on("getrecipes", filter => {
      this.get_recipes_filtered(filter);
    }),
      this.get_recipes_filtered(this.defaults);
  },
  methods: {
    get_recipes_filtered(filters) {
      this.show_input = false;
      this.show_commands = false;
      this.$http
        .get("recipes")
        .then(response => this.recipes_success(response))
        .catch(error => EventBus.$emit("showalert", error.response));
    },
    recipes_success(response) {
      this.recipe_list = response.data;
    },
    get_commands(recipe) {
      var recipe_url = `recipe/${recipe}`;
        this.$http
          .get(recipe_url)
          .then(response => this.command_list = response.data)
          // .catch(error => EventBus.$emit("showalert", error.response));
    },
    delete_recipe(recipe_id) {
      var delete_url = `recipe/${recipe_id}`;
      this.$http
        .delete(delete_url)
        .then(response => this.get_recipes_filtered(this.defaults))
        .catch(error => EventBus.$emit("showalert", error.response));
    }
  }
};
</script>

<style lang="scss" scoped>

.recipespanel {
  .list-group-item {
    border-radius: 0px;
    &.active {
      border-color: white;
      background-color: #9d3a3a;
      .badge {
        background-color: white;
        color: black;
      }
    }
  }
  .card {
    padding: 0px;
  }
  .card-body {
    padding: 0px;
  }
  .badge {
    background-color: #9d3a3a;
  }
}

.selectedrecipe {
  background-color: #9d3a3a;
  color: white;
  .badge {
    background-color: white;
    color: #9d3a3a;
  }
}

.selectedcommand {
  background-color: #9d3a3a;
  color: white;
}



</style>
