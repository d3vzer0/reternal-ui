<template>
  <b-form-select :options="technique_options" required/>
</template>

<script>
export default {
  name: "MitreDropdown",
  data() {
    return {
      technique_options: [],

      error: ""
    };
  },
  mounted() {
    this.get_techniques();
  },
  methods: {
    get_techniques() {
      this.$http
        .get("mitre/techniques")
        .then(response => this.parse_commands(response))
        .catch(response => this.generic_failed(response));
    },
    parse_techniques(response) {
      var technique_list = [];
      response.data.forEach(function(category) {
        var techniques = category.techniques;
        techniques.data.forEach(function(technique) {
          var technique_data = {
            value: technique.technique_id,
            text: technique.name
          };
          technique_list.push(technique_data);
        });
      });
      this.technique_options = technique_list;
    },
    generic_failed(response) {
      this.error = "Unable to perform request";
    }
  }
};
</script>
