<script>
import { Pie, mixins } from 'vue-chartjs' // We specify what type of chart we want from vue-chartjs and the mixins module
const { reactiveProp } = mixins

export default {
  //We are extending the base chart class as mentioned above
  extends: Pie,
  mixins: [reactiveProp],
  data() {
    return {
      options: {
        legend: {
          display: false,
          position: 'right'
        },
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              const index=tooltipItem.index;
              const percent = data.datasets[0].data[index]*100/data.total
              return ` ${Math.floor(percent)}% ${data.labels[index]} `
            }
          }
        }
      }
    }
  },
  methods : {

  },
  mounted() {
    // this.chartData is created in the mixin
    this.renderChart(this.chartData, this.options)
  }
}
</script>