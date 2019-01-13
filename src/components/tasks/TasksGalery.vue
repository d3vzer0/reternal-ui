<template>
  <masonry :cols="3" :gutter="40">
    <b-card class="agent-card" v-for="image in images_list" :img-src="image_data[image._id['$oid']]">
      <b-row>
        <b-col>Timestamp</b-col><b-col>{{to_unix(image.file.uploadDate['$date'])}}</b-col>
      </b-row>
    </b-card>
  </masonry>
</template>

<script>
import Vue from "vue";
import VueMasonry from "vue-masonry-css";
Vue.use(VueMasonry);

export default {
  name: "TasksGalery",
  data() {
    return {
      is_active: false,
      images_list: [],
      image_data: {},
      selected_agent: this.$route.params.agent_id,
      error: ""
    };
  },
  mounted (){
    this.get_images()
  },
  methods: {
    get_images (){ 
      this.$http
        .get("results", {
          params: {beacon_id: this.selected_agent, content_type: "image"}})
        .then(response => this.parse_images(response))
    },
    parse_images(response) {
      this.images_list = response.data;
      this.get_screenshots();
    },
    get_screenshots(){
      for (let [index, element] of this.images_list.entries()) {
       var file_data = this.download_file(element).then(response => {
         var image_id = element._id['$oid'];
         Vue.set(this.image_data, image_id, response)
       })
      }
    },
    download_file(element){
      var file_id = element._id['$oid']
      var file_url = `result/${file_id}`;
      return this.$http.get(file_url, {responseType: 'arraybuffer'}).then( response => {
        var file_object = new Buffer(response.data, 'binary').toString('base64');
        var file_source = "data:image/png;base64, " + file_object;
        return file_source;
      })

    },
    to_unix(unix_timestamp) {
      var from_miliseconds = unix_timestamp / 1000;
      var datetime = this.$moment
        .unix(from_miliseconds)
        .format("YYYY-MM-DD HH:mm:ss");
      return datetime;
    }
  }
};
</script>