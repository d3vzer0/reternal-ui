<template>
  <div class="card mapping-card">
    <div class="card-header mapping-card-header">
      <font-awesome-icon icon="users" />
    </div>
    <div class="card-body mapping-card-body">
      <b-form-input v-model="actor_filter" placeholder="Actor search"></b-form-input>
      <b-list-group>
        <b-list-group-item v-for="actor in filtered_actors" href="#" v-on:click="search_actor(actor)" :active="selected_actor === actor">{{actor}}</b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
import EventBus from "@/eventbus";

export default {
  name: "ActorFilter",
  data() {
    return {
      actor_filter: '',
      selected_actor: '',
      actor_options: []
    };
  },
  computed: {
    filtered_actors () {
      return this.actor_options.filter(actor => {
        return actor.toLowerCase().includes(this.actor_filter.toLowerCase())
      })
    }
  },
  created (){
    this.get_actors_mapped()
  },
  methods: {
    search_actor(actor){
      this.selected_actor = actor
      EventBus.$emit("get_actor_flow", actor);
    },
    get_actors_mapped() {
      this.$http
        .get('/mapping/actors')
        .then(response => this.parse_actors_mapped(response['data']))
    },
    parse_actors_mapped(actors) {
      actors.forEach(actor => {
        this.actor_options.push(actor)
      });
    }
  }
}
</script>

<style lang="scss" scoped>
#platform-filter {
  max-width: 250px;
}

.mapping-card {
  .list-group {
    max-height: 80vh;
    margin-bottom: 10px;
    overflow-x: hidden; 
    .list-group-item {
      border-radius: 0px;
    }
  }
  .mapping-card-body {
    padding: 0;
    .list-group{
      .list-group-item {
        &.active {
          border: 0px;
          background-color: #9e1c1d;
        }
      }
    }
    .platform-select {
      border-radius: 0px;
    }
  }
  .mapping-card-header{
    border-radius: 0px;
    border: 2px;
    border-width: 3px;
    text-align: center;
    background-color: #f4f2f2;
    color: #4c5c68;
    font-size: 60px;
  }
}

</style>
