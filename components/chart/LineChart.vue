<script>
import moment from 'moment'
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  data() {
    return {
      currentYear: moment().format('YYYY'),
      options: {
        legend: {
          display: true
        },
        title: {
          display: true,
          text: 'Biểu đồ thu chi ' + moment().format('YYYY'),
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                callback: function(value, index, values) {
                  let val = (value / 1).toFixed(0).replace('.', ',')
                  return ` ${val
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}đ`
                }
              }
            }
          ]
        },
        responsive: true
      }
    }
  },
  methods: {
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.chartData, this.options)
  }
}
</script>