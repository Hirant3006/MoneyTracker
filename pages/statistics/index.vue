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

        <v-layout v-if="filterdealbydate!==null" justify-space-between row wrap>
          <v-flex xs12 sm12 md12 lg12 xl12>
            <v-alert
              v-if="!comparedate(date1,date2)"
              v-model="alert"
              type="error"
            >Ngày sau phải lớn hơn ngày trước.</v-alert>
            <v-card v-else>
              <v-card-title>
                <v-layout justify-center column>
                  <pie-chart style="height:250px" :chart-data="filterdealbydate"></pie-chart>
                  <v-list>
                    <v-list-tile
                      v-for="(item,index) in filterdealbydate.labels"
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
                        v-html="`${formatPrice(filterdealbydate.datasets[0].data[index])} đ`"
                      ></v-list-tile-title>
                    </v-list-tile>
                  </v-list>
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
const Label = {
  expense: [
    'Ăn uống',
    'Con cái',
    'Dịch vụ',
    'Đi lại',
    'Hiếu hỉ',
    'Hưởng thụ',
    'Sức khỏe',
    'Trang phục',
    'Khác'
  ],
  income: ['Tiền thưởng', 'Lương', 'Được tặng', 'Khoảng khác']
}
const dummydata = {
  //Data to be represented on x-axis
  labels: ['Red', 'Yellow', 'Blue'],
  datasets: [
    {
      borderAlign: 'center',
      backgroundColor: colorset,
      data: [10, 20]
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
      labelList: Label,
      date1: null,
      modaldate1: false,
      date2: null,
      modaldate2: false,
      deals: null,
      dealType: 'expense',
      loadingchart: false
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
    filterdealbydate() {
      let array = []
      let labels = []
      let data = []
      let datatotal = 0
      if (this.date1 !== null && this.date2 !== null && this.deals !== null) {
        array = this.deals.filter(
          element =>
            moment(element.date).diff(moment(this.date1)) > 0 &&
            moment(element.date).diff(moment(this.date2)) < 0 &&
            element.type === this.dealType
        )
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
