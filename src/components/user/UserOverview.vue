<template>
  <ServerSide :dataloc="data_loc" :queryparams="query_params" :countloc="count_loc" :limit="limit" :filter="search_filter" :output="output" :expectedfields="expected_fields" :target="target_url"></ServerSide>
</template>


<script>
import EventBus from "@/eventbus";
import ServerSide from "@/components/table/ServerSide";

export default {
  name: "TasksTable",
  components: {
    ServerSide
  },
  data (){
    return {
      search_filter: "",
      query_params: {},
      count_loc: "count",
      data_loc: "data",
      target_url: "users",
      limit: 30,
      expected_fields: {
        role: "role",
        username: "username",
        userid: "_id.$oid",
        _showDetails: false

      },
      output: {
        username: {label: "Username"},
        role: {label: "Role"},
        userid: {label: "ID"},
        change_user: {label: "Change"},
        delete_user: {label: "Delete"}

      }
    }
  },
  created (){
    EventBus.$on("deleteuser", username => this.delete_user(username));
  },
  methods: {
    delete_user(username) {
      var user_url = `user/${username}`;
      this.$http.delete(user_url)
        .then(EventBus.$emit('changetaskfilter', ""))
    }
  }
}
</script>
 
 