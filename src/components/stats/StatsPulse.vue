<template>
  <b-card class="pulsecard" header-tag="header">
    <PulseChart :chart-data="datacollection" :height="140" :options="options"></PulseChart>
  </b-card>
</template>

<script>
import PulseChart  from '@/components/stats/Pulse.js'

export default {
  components: {
    PulseChart 
  },
  data () {
    return {
      datacollection: null,
      options: {
        responsive: true,
        maintainAspectRatios: false,
        scales: {
          xAxes: [
            {
              type: 'time',
              time: {
   
              }
            }
          ],
           yAxes: [{
            ticks: {
                beginAtZero: true,
                 // stepSize: 1
            }
        }]
        },
      }
    }
  },
  mounted () {
    this.get_pulse()
  },
  methods: {
     get_pulse (){
      this.$http
        .get('stats/pulse')
        .then(response => this.parse_pulse(response))
        .catch(response => this.generic_failed(response))
    },
    parse_pulse (response){
      var collection = {
        labels: [],
        datasets: [{ 
          data: [],
          // backgroundColor: "#9a4f4f",
          borderColor: "#9d3a3a"
        }]
      };
      response.data.forEach(pulse => {
        var dd = pulse["_id"]
        var parsed_date = `${dd.year}-${dd.month}-${dd.day} ${dd.hour}:00`;
        var date_object = new Date(parsed_date)
        collection.labels.push(date_object)
        var data = {t: date_object, y:pulse.total}
        collection.datasets[0]["data"].push(data)
      });
      this.datacollection = collection;
    },
   
  }
}
</script>

<style lang="sass">

</style>
