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
      query_params: {content_type: "text"},
      count_loc: "count",
      data_loc: "data",
      target_url: "results",
      limit: 30,
      expected_fields: {
        timestamp: "end_date.$date",
        type: "type",
        command: "command",
        input: "input",
        taskid: "_id.$oid",
        _showDetails: false
      },
      output: {
        timestamp: {label: "End date"},
        type: {label: "Type"},
        command: {label: "Name"},
        input: {label: "Input"},
        show_text: {label :"Show output"}
      }
    }
  }
}
</script>
 
 