export default {
    namespaced: true,
    state: {
      actors: [
        { text: "Any", value: "" },
      ],
      loading: false,
    },
    getters: {
      get_actors (state) {
        return state.actors;
      }
    },
    mutations: {
      add_actors (state, actors) {
        actors.forEach(actor => {
          var option_object = { text: actor, value: actor }
          if(state.actors.map(option => option.value).indexOf(actor) === -1) {
            state.actors.push(option_object)
          }  
        });  
      }
    }
  };
  