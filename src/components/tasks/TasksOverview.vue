<template>
  <ServerSide :dataloc="data_loc" :countloc="count_loc" :limit="limit" :filter="search_filter" :output="output" :expectedfields="expected_fields" :target="target_url"></ServerSide>
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
      count_loc: "count",
      data_loc: "data",
      target_url: "tasks",
      limit: 30,
      expected_fields: {
        timestamp: "start_date.$date",
        name: "name",
        task_status: "task_status",
        command_count: "commands",
        result_count: "output",
        commands: "commands",
        _showDetails: false
      },
      output: {
        timestamp: {label: "Timestamp"},
        name: {label: "Name"},
        task_status: {label: "Task Status"},
        command_count: {label: "Amount of commands"},
        result_count: {label: "Number of results"},
        show_details: {label: "Show details"}
      }
    }
  }
}
</script>
 
 