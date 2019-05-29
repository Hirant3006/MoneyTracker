<template>
  <div>
    <div>
      <v-divider class="mb-2"/>
      <v-layout justify-space-between @click="budgetDetailDialog=true" style="cursor:pointer">
        <div>
          <v-list-tile-title>{{budgetItem.nameBudget}}</v-list-tile-title>
          <v-list-tile-sub-title>{{formatDate(budgetItem.startDate,'DM')}} - {{formatDate(budgetItem.endDate,'DM')}}</v-list-tile-sub-title>
        </div>
        <div style="align-self:center">
          <v-list-tile-title>{{formatPrice(budgetItem.amount)}} đ</v-list-tile-title>
          
        </div>
      </v-layout>
      <v-progress-linear :value="process" :color="process>100 ? 'red' : 'blue'"></v-progress-linear>
      <v-layout justify-space-between>
        <div>
          <v-list-tile-title>Còn {{countdownDay(budgetItem.endDate)}}</v-list-tile-title>
        </div>
        <div>
          <v-list-tile-title>
            Thực chi:
            <span
              :style="process>100? 'color:red' : 'color:black'"
            >{{formatPrice(totalSpent)}} đ</span>
          </v-list-tile-title>
        </div>
      </v-layout>
    </div>

    <budget-detail
      :budgetDetailDialog="budgetDetailDialog"
      :listDealData="dealDataByBudget"
      :budgetItem="budgetItem"
      :process="process"
      :totalSpent="totalSpent"
      :remain="remain"
      @close-dialog="budgetDetailDialog=false"
    />
  </div>
</template>

<script>
import moment from 'moment'
import firebase from '@/services/fireinit.js'
import budgetDetail from './budgetDetail.vue'

export default {
  components: {
    'budget-detail': budgetDetail
  },
  data: function() {
    return {
      budgetDetailDialog: false,
      process: 0,
      totalSpent: 0,
      remain: 0,
      dealDataByBudget: []
    }
  },
  mounted() {
    this.readBudgetData()
  },
  methods: {
    async readBudgetData() {
      let totalSpent = 0
      let array = []
      const uid = firebase.auth().currentUser.uid
      if (this.budgetItem.account === 'Tất cả tài khoản') {
        await firebase
          .database()
          .ref(`${uid}/TotalDeals`)
          .on('value', async snapshot => {
            let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
            keys.map(async (item, index) => {
              if (
                moment(snapshot.val()[item].date).diff(
                  moment(this.budgetItem.startDate)
                ) > 0 &&
                moment(snapshot.val()[item].date).diff(
                  moment(this.budgetItem.endDate)
                ) < 0
              ) {
                if (
                  snapshot.val()[item].categories === this.budgetItem.categories
                ) {
                  totalSpent =
                    totalSpent + parseInt(snapshot.val()[item].amount)
                  array.push(snapshot.val()[item])
                }
              }
            })
            let processRate = totalSpent / this.budgetItem.amount
            let remain = this.budgetItem.amount - totalSpent
            this.process = processRate
            this.dealDataByBudget = array
            this.totalSpent = totalSpent
            this.remain = remain
            totalSpent = 0
            array = []
          })
      } else {
        await firebase
          .database()
          .ref(`${uid}/Deals/${this.budgetItem.accountKey}`)
          .on('value', async snapshot => {
            let keys = (snapshot.val() && Object.keys(snapshot.val())) || []
            keys.map(async (item, index) => {
              if (
                moment(snapshot.val()[item].date).diff(moment(item.startDate)) >
                  0 &&
                moment(snapshot.val()[item].date).diff(moment(item.endDate)) < 0
              ) {
                if (
                  snapshot.val()[item].categories === this.budgetItem.categories
                ) {
                  totalSpent =
                    totalSpent + parseInt(snapshot.val()[item].amount)
                  array.push(snapshot.val()[item])
                }
              }
            })
            let processRate = totalSpent / this.budgetItem.amount
            let remain = this.budgetItem.amount - totalSpent
            this.process = processRate
            this.dealDataByBudget = array
            this.totalSpent = totalSpent
            this.remain = remain
            totalSpent = 0
            array = []
          })
      }
    },
    countdownDay(endDate) {
      let milisecondTime = moment(endDate).diff(moment(new Date()))
      const day = Math.floor(milisecondTime / 1000 / 60 / 60 / 24),
        hour = Math.floor(
          (milisecondTime / 1000 / 60 / 60 / 24 -
            Math.floor(milisecondTime / 1000 / 60 / 60 / 24)) *
            24
        )

      return `${day} ngày ${hour} giờ`

      // return (`Còn ${Number(milisecondTime/1000/60/60/24)} ngày ${Number((milisecondTime/1000/60/60/24-Number(milisecondTime/1000/60/60/24))*24)} giờ`)
    },
    formatDate(date, type) {
      switch (type) {
        case 'DM':
          return moment(date).format('DD/MM')
        case 'MY':
          return moment(date).format('MM-YYYY')
        case 'YMD':
          // code block
          return moment(date).format('YYYY-MM-DD')
        case 'D':
          return moment(date).format('DD')
        case 'M':
          return moment(date).format('MM')
        case 'Y':
          return moment(date).format('YYYY')
        case 'W':
          switch (moment(date).day()) {
            case 1:
              return 'Monday'
            case 2:
              return 'Tuesday'
            case 3:
              return 'Wednesday'
            case 4:
              return 'Thursday'
            case 5:
              return 'Friday'
            case 6:
              return 'Saturday'
            case 7:
              return 'Sunday'
          }
        default:
          return null
      }
    },
    formatPrice(value) {
      let val = (value / 1).toFixed(0).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }
  },
  props: {
    budgetItem: {
      type: Object,
      required: true
    }
  },
  watch: {
    process() {}
  }
}
</script>

<style>
</style>
