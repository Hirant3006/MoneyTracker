<template>
  <div>
    <div>
      <v-divider class="mb-3"/>
      <v-layout justify-space-between @click="budgetDetailDialog=true" style="cursor:pointer">
        <div style="display:flex">
          <v-avatar size="40px" color="grey lighten-4">
            <img :src="getIconCategories(budgetItem.categories) ">
          </v-avatar>
          <div class="ml-3">
            <v-list-tile-title>{{budgetItem.nameBudget}}</v-list-tile-title>
            <v-list-tile-sub-title>{{formatDate(budgetItem.startDate,'DM')}} - {{formatDate(budgetItem.endDate,'DM')}}</v-list-tile-sub-title>
          </div>
        </div>
        <div style="align-self:center">
          <v-list-tile-title>{{formatPrice(budgetItem.amount)}} đ</v-list-tile-title>
        </div>
      </v-layout>
      <v-progress-linear :value="process" :color="process>100 ? 'red' : 'blue'"></v-progress-linear>
      <v-layout justify-space-between mb-2>
        <div>
          <v-list-tile-title :style="countdownDay(budgetItem.endDate) === 'Hạn mức này đã quá hạn' ? 'color:red' :null">{{countdownDay(budgetItem.endDate)}}</v-list-tile-title>
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
    getIconCategories(categoriesName) {
      switch (categoriesName) {
        case 'Ăn tiệm':
          return require('@/assets/Image/breakfast.png')
        case 'Cafe':
          return require('@/assets/Image/coffee-cup.png')
        case 'Ăn nhậu':
          return require('@/assets/Image/beer.png')
        case 'Đồ chơi':
          return require('@/assets/Image/toys.png')
        case 'Học phí':
          return require('@/assets/Image/money.png')
        case 'Sách vở':
          return require('@/assets/Image/open-book.png')
        case 'Sữa':
          return require('@/assets/Image/milk.png')
        case 'Tiền tiêu vặt':
          return require('@/assets/Image/money.png')
        case 'Điện':
          return require('@/assets/Image/idea.png')
        case 'Điện thoại cố định':
          return require('@/assets/Image/cellular.png')
        case 'Điện thoại di dộng':
          return require('@/assets/Image/smartphone.png')
        case 'Gas':
          return require('@/assets/Image/fire.png')
        case 'Internet':
          return require('@/assets/Image/wifi.png')
        case 'Nước':
          return require('@/assets/Image/drop.png')
        case 'Truyền hình':
          return require('@/assets/Image/television.png')
        case 'Bảo hiểm xe':
          return require('@/assets/Image/car-insurance.png')
        case 'Gửi xe':
          return require('@/assets/Image/parking.png')
        case 'Rửa xe':
          return require('@/assets/Image/car-wash.png')
        case 'Sửa chữa':
          return require('@/assets/Image/car-lift.png')
        case 'Taxi/ thuê xe':
          return require('@/assets/Image/taxi.png')
        case 'Xăng xe':
          return require('@/assets/Image/gas.png')
        case 'Biếu tặng':
          return require('@/assets/Image/gift.png')
        case 'Sinh nhật':
          return require('@/assets/Image/birthday-cake.png')
        case 'Cưới xin':
          return require('@/assets/Image/rings.png')
        case 'Du lịch':
          return require('@/assets/Image/world.png')
        case 'Làm đẹp':
          return require('@/assets/Image/lipstick.png')
        case 'Mỹ phẩm':
          return require('@/assets/Image/lipstick.png')
        case 'Phim ảnh, ca nhạc':
          return require('@/assets/Image/popcorn.png')
        case 'Khám, chữa bệnh':
          return require('@/assets/Image/stethoscope.png')
        case 'Thuốc men':
          return require('@/assets/Image/medicine.png')
        case 'Giày, dép':
          return require('@/assets/Image/shoe.png')
        case 'Quần, áo':
          return require('@/assets/Image/tshirt.png')
        case 'Phụ kiện khác':
          return require('@/assets/Image/tie.png')
        case 'Tiền thưởng':
          return require('@/assets/Image/bonus.png')
        case 'Lương':
          return require('@/assets/Image/salary.png')
        case 'Được tặng':
          return require('@/assets/Image/gift.png')
        case 'Bán đồ':
          return require('@/assets/Image/sale.png')
        case 'Khoản thu khác':
          return require('@/assets/Image/money.png')
        case 'Khoản chi khác':
          return require('@/assets/Image/money.png')
        case 'Đi vay':
          return require('@/assets/Image/offer.png')
        case 'Thu nợ':
          return require('@/assets/Image/repay.png')
        case 'Trả nợ':
          return require('@/assets/Image/payment-method.png')
        case 'Cho vay':
          return require('@/assets/Image/save-money.png')
        case 'Chuyển khoản':
          return require('@/assets/Image/transfer.png')
        default:
          return require('@/assets/Image/question-mark.png')
      }
    },
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
                ) >= 0 &&
                moment(snapshot.val()[item].date).diff(
                  moment(this.budgetItem.endDate)
                ) <= 0
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
            let processRate = (totalSpent * 100) / this.budgetItem.amount
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
                moment(snapshot.val()[item].date).diff(
                  moment(this.budgetItem.startDate)
                ) >= 0 &&
                moment(snapshot.val()[item].date).diff(
                  moment(this.budgetItem.endDate)
                ) <= 0 &&
                snapshot.val()[item].categories === this.budgetItem.categories
              ) {
                totalSpent = totalSpent + parseInt(snapshot.val()[item].amount)
                array.push(snapshot.val()[item])
              }
            })

            let processRate = (totalSpent * 100) / this.budgetItem.amount
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
      if (day < 0) return 'Hạn mức này đã quá hạn'
      else return `Còn ${day} ngày ${hour} giờ`

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
    process() {
      // console.log('Budget Item ',this)
    }
  }
}
</script>

<style>
</style>
