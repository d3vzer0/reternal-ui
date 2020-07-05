<template>
  <q-card flat class="actor-data">
    <q-card-section>
    <div class="text-h6">Actor details</div>
    <div class="text-h7" v-if="!actorData.name">Select an actor to view details and filter techniques</div>
    </q-card-section>

    <q-card-section v-if="actorData.name">
    <div class="row">
        <div class="col-2">
        <b>Name</b>
        </div>
        <div class="col" >
        {{ actorData.name }}
        </div>
    </div>
    <div class="row">
        <div class="col-2">
        <b>Description</b>
        </div>
        <div class="col">
        <q-markdown :src="actorData.description"></q-markdown>
        </div>
    </div>
    <div class="row">
        <div class="col-2">
        <b>Aliases</b>
        </div>
        <div class="col">
        {{ (actorData.aliases && actorData.aliases.length > 0) ? actorData.aliases.join(', ') : "" }}
        </div>
    </div>
    </q-card-section>
  </q-card>
</template>
<script>

export default {
  name: 'ActorDetails',
  props: {
    name: String
  },
  data () {
    return {
      actorData: {
      }
    }
  },
  watch: {
    name: function (actor) {
      if (actor === '') {
        this.actorData = {}
      } else {
        this.getActorDetails(actor)
      }
    }
  },
  methods: {
    getActorDetails (actor) {
      this.$axios
        .get('/mitre/actor/' + this.name)
        .then(response => this.getActorDetailsSuccess(response['data']))
    },
    getActorDetailsSuccess (details) {
      this.actorData = details
    }
  }
}
</script>
