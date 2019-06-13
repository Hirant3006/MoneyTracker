<template>
  <v-dialog v-model="budgetDetailDialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline font-weight-medium">Chi tiết hạn mức</span>
        <v-spacer></v-spacer>
        <v-menu offset-y ml-5>
          <template v-slot:activator="{ on }">
            <v-btn flat icon v-on="on">
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-tile
              v-for="(info, index) in items"
              :key="index"
              @click="onToggleMore(info,item)"
              style="padding-left:0px;border:0px"
            >
              <v-icon style="margin-right: 10px;" class>{{info.icon}}</v-icon>
              <v-list-tile-title>{{ info.title }}</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-text style="padding-top:0px">
        <v-layout justify-space-between>
          <div>
            <span class="subheading font-weight-medium mb-3">
              <v-avatar size="40px" color="grey lighten-4">
                <img :src="getIconCategories(budgetItem.categories) ">
              </v-avatar>
              &nbsp;
              {{budgetItem.nameBudget}}
            </span>
          </div>
          <div class="font-weight-medium" style="display:flex;flex-direction:column">
            <span style="text-align:right">{{budgetItem.categories}}</span>
            <span>{{budgetItem.accountType}}</span>
          </div>
        </v-layout>
        <v-layout
          mt-1
          justify-space-between
          @click="budgetDetailDialog=true"
          style="cursor:pointer"
        >
          <div style="display:flex;flex-direction:column">
            <span
              class="font-weight-medium"
            >{{formatDate(budgetItem.startDate,'DM')}} - {{formatDate(budgetItem.endDate,'DM')}}</span>
          </div>
          <div style="align-self:center">
            <span class="font-weight-medium">{{formatPrice(budgetItem.amount)}} đ</span>
          </div>
        </v-layout>
        <v-progress-linear :value="process" :color="process>100 ? 'red' : 'blue'"></v-progress-linear>
        <v-layout justify-space-between>
          <div>
            <span class="font-weight-medium">Còn {{countdownDay(budgetItem.endDate)}}</span>
          </div>
          <div>
            <span>
              Thực chi:
              <span
                :style="process>100? 'color:red' : 'color:black'"
              >{{formatPrice(totalSpent)}} đ</span>
            </span>
          </div>
        </v-layout>
        <div class="mt-2" style="display:flex;justify-content:flex-end">
          <v-btn small flat @click="showDealData = !showDealData">
            Chi tiết giao dịch
            <v-icon v-if="showDealData==false" right dark>arrow_downward</v-icon>
            <v-icon v-else right dark>arrow_upward</v-icon>
          </v-btn>
        </div>
        <v-data-table
          light
          no-data-text="Không có giao dịch"
          v-if="showDealData"
          :pagination.sync="pagination"
          hide-actions
          hide-headers
          :items="listDealData"
          class="elevation-1 mt-2 mb-2"
        >
          <template v-slot:items="props">
            <td class="text-xs-center">
              <v-avatar size="30px" color="grey lighten-4">
                <img :src="getIconCategories(props.item.categories) ">
              </v-avatar>
              {{ props.item.account }}
            </td>
            <td
              class="text-xs-center"
              style="display:flex;flex-direction:column;justify-content:center"
            >
              <span>{{ formatDate(props.item.date,'YMD') }}</span>
              <span>{{ formatDate(props.item.date,'TIME') }}</span>
            </td>
            <td class="text-xs-center">{{ formatPrice(props.item.amount) }} đ</td>
          </template>
        </v-data-table>
        <v-layout mt-3 justify-space-between pl-3 pr-3>
          <div style="text-align:center;display:flex;flex-direction:column;align-self:flex-start">
            <span class="font-weight-regular">Thực tế chi tiêu</span>
            <span
              class="font-weight-light font-italic"
            >{{new Intl.NumberFormat().format(parseInt(totalSpent) / (parseInt(time) + 1))}} đ/ngày</span>
          </div>

          <div style="text-align:center;display:flex;flex-direction:column;align-self:flex-start">
            <span class="font-weight-regular">Nên chi</span>
            <span
              v-if="remain>0"
              class="font-weight-light font-italic"
            >{{new Intl.NumberFormat().format(parseInt(remain) / parseInt(convertMiliseconds(Moment().range(moment().format(), moment(budgetItem.endDate).format()).valueOf(), 'd')))}} đ/ngày</span>
            <span class="font-weight-light font-italic" v-else>0 đ/ngày</span>
          </div>
        </v-layout>
        <div style="text-align:center;display:flex;flex-direction:column;align-self:flex-end">
          <span class="font-weight-regular">Dự kiến chi tiêu</span>
          <span
            class="font-weight-light font-italic"
          >{{formatPrice(moment(budgetItem.endDate).daysInMonth()*(parseInt(totalSpent) / (parseInt(time) + 1)))}} đ</span>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" flat @click="$emit('close-dialog')">Đóng</v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="confirmDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="subheading">
          <h4>Bạn muốn xoá hạn mức này ?</h4>
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="confirmDialog = false">Không</v-btn>
          <v-btn color="green darken-1" flat @click="onPressDeleteBudget">Có</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <edit-budget-dialog @close-dialog='editBudgetDialog=false' :editBudgetDialog="editBudgetDialog" :budgetItem="budgetItem"/>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import { extendMoment } from 'moment-range'
import { mapMutations } from 'vuex'
import firebase from '@/services/fireinit.js'
import editBudgetDialog from './editBudgetDialog'

const Moment = extendMoment(moment)

export default {
  components: {
    'edit-budget-dialog':editBudgetDialog,
  },
  data: function() {
    return {
      Moment: Moment,
      moment: moment,
      confirmDialog: false,
      editBudgetDialog: false,
      items: [
        {
          title: 'Sửa',
          icon: 'edit'
        },
        { title: 'Xóa', icon: 'delete' }
      ],
      time: '',
      pagination: {},
      paging: {
        descending: true,
        page: 1,
        rowsPerPage: 3 // -1 for All",
      },
      showDealData: false
    }
  },
  props: {
    remain: {
      type: Number,
      required: true
    },
    budgetItem: {
      type: Object,
      required: true
    },
    listDealData: {
      type: Array,
      required: true
    },
    budgetDetailDialog: {
      type: Boolean,
      required: true
    },
    process: {
      type: Number,
      required: true
    },
    totalSpent: {
      type: Number,
      required: true
    }
  },
  methods: {
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    }),
    async onPressDeleteBudget() {
      const uid = await firebase.auth().currentUser.uid
      await firebase
        .database()
        .ref(`${uid}/Budget/${this.budgetItem.key}`)
        .remove()
      this.$emit('close-dialog')
      this.setSnack({ msg: 'Xóa hạn mức thành công', color: 'success' })
    },
    onToggleMore(info, item) {
      if (info.title === 'Xóa') {
        this.confirmDialog = true
        this.deleteItem = item
      }
      if (info.title === 'Sửa') {
        this.editBudgetDialog = true
        this.editAccountItem = item
      }
    },
    getIconCategories(categorieName) {
      switch (categorieName) {
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
        case 'TIME':
          return moment(date).format('HH:MM')
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
    },
    convertMiliseconds(miliseconds, format) {
      var days,
        hours,
        minutes,
        seconds,
        total_hours,
        total_minutes,
        total_seconds

      total_seconds = parseInt(Math.floor(miliseconds / 1000))
      total_minutes = parseInt(Math.floor(total_seconds / 60))
      total_hours = parseInt(Math.floor(total_minutes / 60))
      days = parseInt(Math.floor(total_hours / 24))

      seconds = parseInt(total_seconds % 60)
      minutes = parseInt(total_minutes % 60)
      hours = parseInt(total_hours % 24)

      switch (format) {
        case 's':
          return total_seconds
          break
        case 'm':
          return total_minutes
          break
        case 'h':
          return total_hours
          break
        case 'd':
          return days
          break
        default:
          return { d: days, h: hours, m: minutes, s: seconds }
      }
    }
  },
  mounted() {
    // console.log(this.listDealData)
    // console.log(this.budgetItem)
    this.time = this.convertMiliseconds(
      Moment()
        .range(moment(this.budgetItem.startDate).format(), moment().format())
        .valueOf(),
      'd'
    )
  },
  watch: {
    listDealData() {
    }
  }
}
</script>

<style>
</style>
