<template>
  <div class="actors">
    <b-row class="top-10">
      <b-col cols="2">
        <ActorFilter></ActorFilter>
      </b-col>
      <b-col cols="8">
        <ActorOverview></ActorOverview>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import ActorFilter from '@/components/actors/ActorFilter'
import ActorOverview from '@/components/actors/ActorOverview'

export default {
  name: 'ActorMapping',
  data() {
    return {};
  },
  components: {
    ActorFilter,
    ActorOverview
  }
};
</script>
