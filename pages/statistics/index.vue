<template>
  <v-layout justify-center align-center>
    <v-flex xs12 sm8>
      <v-container grid-list-lg>
        <v-flex xs12>
          <v-card>
            <v-card-title>
              <v-layout justify-center>
                <v-flex xs12 sm12 md6 lg6 xl6>
                  <v-dialog
                    ref="dialog"
                    v-model="modaldate1"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date1"
                        label="Từ ngày"
                        prepend-icon="calendar_today"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date1" scrollable></v-date-picker>
                  </v-dialog>
                </v-flex>
                <v-flex xs12 sm12 md6 lg6 xl6>
                  <v-dialog
                    ref="dialog"
                    v-model="modaldate2"
                    persistent
                    lazy
                    full-width
                    width="290px"
                  >
                    <template v-slot:activator="{ on }">
                      <v-text-field
                        v-model="date2"
                        label="Đến ngày"
                        prepend-icon="calendar_today"
                        readonly
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker v-model="date2" scrollable></v-date-picker>
                  </v-dialog>
                </v-flex>
              </v-layout>
            </v-card-title>
          </v-card>
        </v-flex>

        <v-layout justify-space-between row wrap>
          <v-flex v-if="piedata!==null" xs12 sm12 md12 lg12 xl12>
            <v-alert
              v-if="!comparedate(date1,date2)"
              v-model="alert"
              type="error"
            >Ngày sau phải lớn hơn ngày trước idiot ( ͠° ͟ʖ ͡°)</v-alert>
            <v-card v-else-if="piedata.total===0">
              <v-layout justify-center>
                <v-card-title class="subheading">Mày đâu có móc tiền trong lúc này đâu ??</v-card-title>
              </v-layout>
            </v-card>
            <v-card v-else>
              <v-card-title>
                <v-layout justify-center column>
                  <pie-chart style="height:250px" :chart-data="piedata"></pie-chart>
                  <v-list>
                    <v-list-tile
                      v-for="(item,index) in piedata.labels"
                      :key="index"
                      avatar
                      class="pr-2 pl-2"
                    >
                      <v-list-tile-avatar>
                        <v-icon :color="colorset[index]">fiber_manual_record</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-title v-html="item"></v-list-tile-title>
                      <v-list-tile-title
                        style="text-align:right;color:red"
                        v-html="`${formatPrice(piedata.datasets[0].data[index])} đ`"
                      ></v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-layout>
              </v-card-title>
            </v-card>
          </v-flex>
          <v-flex v-else xs12 sm12 md12 lg12 xl12>
            <v-card>
              <v-layout justify-center>
                <v-card-title
                  class="subheading"
                >Chọn thời gian đi, để tao xem mày chi tiền ngáo thế nào :) ??</v-card-title>
              </v-layout>
            </v-card>
          </v-flex>
        </v-layout>
        <v-layout justify-space-between row wrap>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-card>
              <v-card-title>
                <v-layout v-if="linedata!==null" justify-center column>
                  <line-chart class="mt-2"  :chart-data="linedata"/>
                </v-layout>
                <v-layout v-else mt-1 mb-1 justify-center>
                  <v-progress-circular indeterminate></v-progress-circular>
                </v-layout>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-flex>
  </v-layout>
</template>

<script>
const colorset = [
  '#e97a7a',
  '#516091',
  '#eef3ad',
  '#74bec1',
  '#8b4f80',
  '#c1867b',
  '#b9c0d5',
  '#8b76a5',
  '#bfcfff'
]

const dummydata = {
  labels: [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ],
  datasets: [
    {
      label: 'Data One',
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      data: [40, 39, 10, 40, 39, 80, 40, 90, 120, 12, 123, 41]
    }
  ]
}
import categoriesData from '@/common/categoriesData.js'
import PieChart from '@/components/chart/PieChart.vue'
import LineChart from '@/components/chart/LineChart.vue'
import firebase from '@/services/fireinit.js'
import { mapMutations } from 'vuex'
import moment from 'moment'

export default {
  components: {
    'pie-chart': PieChart,
    'line-chart': LineChart
  },
  data: function() {
    return {
      alert: true,
      colorset,
      categoriesData,
      date1: null,
      modaldate1: false,
      date2: null,
      modaldate2: false,
      deals: null,
      dealType: 'expense',
      loadingchart: false,
      currentYear: moment().format('YYYY')
    }
  },
  mounted() {
    this.readDealsData()
  },
  methods: {
    comparedate(date1, date2) {
      return moment(date2).diff(moment(date1)) > 0 ? true : false
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getRandomInt() {
      return Math.floor(Math.random() * (50 - 5 + 1)) + 5
    },
    // isBetween(startDate, endDate, date) {
    //   var range = moment().range(startDate, endDate)
    //   return range.contains(date) // false
    // },
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    async readDealsData() {
      let array = []
      const uid = await firebase.auth().currentUser.uid
      var ref = await firebase.database().ref(`${uid}/TotalDeals`)
      await ref
        .orderByValue()
        .limitToLast(5)
        .on('value', snapshot => {
          let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
          keys.map((item, index) => {
            array.push(snapshot.val()[item])
          })
          this.deals = array
          array = []
        })
    }
    // sortData(array){
    //   array.forEach
    //   this.categoriesData.forEach(element => {
    //     element.data.filters()
    //   });
    // }
  },
  computed: {
    piedata() {
      let array = []
      let labels = []
      let data = []
      let datatotal = 0
      if (this.date1 !== null && this.date2 !== null && this.deals !== null) {
        array = this.deals.filter(
          element =>
            moment(element.date).diff(moment(this.date1)) > 0 &&
            moment(element.date).diff(moment(this.date2)) < 0 &&
            element.type.localeCompare(this.dealType) === 0
        )
        console.log('array ', array)
        if ((this.dealType = 'expense')) {
          this.categoriesData.expense.forEach(element => {
            let total = 0
            element.data.forEach(type => {
              array.forEach(deal => {
                if (type.localeCompare(deal.categories) === 0)
                  total += deal.amount
              })
            })
            if (total > 0) {
              data.push(total)
              labels.push(element.title)
              datatotal += total
              total = 0
            } else total = 0
          })
        }
        return {
          labels,
          datasets: [
            {
              borderAlign: 'center',
              backgroundColor: colorset,
              data
            }
          ],
          total: datatotal
        }
      } else return null
    },
    linedata() {
      let expense = []
      let income = []
      const currentMonthYear = moment().format('YYYY')
      if (this.deals !== null) {
        for (let i = 0; i < 12; i++) {
          expense[i] = 0
          income[i] = 0
          this.deals.forEach(item => {
            if (
              moment(item.date)
                .format('M-YYYY')
                .localeCompare(i + 1 + '-' + currentMonthYear) === 0
            ) {
              if (item.type.localeCompare('expense') === 0)
                expense[i] += item.amount
              else income[i] += item.amount
            }
          })
        }
        return {
          labels: [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12'
          ],
          datasets: [
            {
              label: 'Tiền chi',
              borderColor: '#f6a7ba',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              data: expense
            },
            {
              label: 'Tiền thu',
              borderColor: '#72d6c9',
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              data: income
            }
          ]
        }
      }
      return null
      // console.log(expense, income)
    }
  },
  watch: {
    date1() {
      this.modaldate1 = false
    },
    date2() {
      this.modaldate2 = false
    },
    deals() {
      console.log('Deals ', this.deals)
    }
  }
}
</script>

<style>
</style>
